import { HttpException } from '@exceptions/HttpException';
import { CreateExpenseDto } from '@dtos/expenses.dto';
import { Expense } from '@interfaces/expenses.interface';
import expenseModel from '@models/expenses.model';
import balanceModel from '@models/balances.model';
import userModel from '@models/users.model';
import { REVERSE_BALANCE_ON_DELETE } from '@config';
import { Balance } from '@/interfaces/balances.interface';

class ExpenseService {
  public expenses = expenseModel;
  public balances = balanceModel;
  public users = userModel;

  public async createExpense(expenseData: CreateExpenseDto): Promise<Expense> {
    try {
      const { name, description, totalAmount, payer, splitType, participants } = expenseData;

      // checking if payer exists
      const payerExists = await this.users.findById(payer);
      if (!payerExists) throw new HttpException(404, 'Payer not found');

      const processedParticipants = [];
      let sumShares = 0;
      // Process participants based on split type
      if (splitType === 'EQUAL') {
        const shareAmount = parseFloat((totalAmount / participants.length).toFixed(2));
        let remainder = parseFloat((totalAmount - shareAmount * participants.length).toFixed(2));

        for (let i = 0; i < participants.length; i++) {
          let finalShare = shareAmount;
          // Distribute any remainder to the payer to ensure total shares sum up to totalAmount
          if (participants[i].user === payer.toString()) {
            finalShare += remainder;
            finalShare = parseFloat(finalShare.toFixed(2));
          }

          processedParticipants.push({
            user: participants[i].user,
            share: finalShare,
          });
          sumShares = sumShares + finalShare;
        }
      } else if (splitType === 'UNEQUAL') {
        for (let i = 0; i < participants.length; i++) {
          const singleParticipant = participants[i];
          if (singleParticipant.share === undefined)
            throw new HttpException(400, `Share is missing for user ${singleParticipant.user} in UNEQUAL split`);
          processedParticipants.push({
            user: singleParticipant.user,
            share: singleParticipant.share,
          });
          sumShares = sumShares + singleParticipant.share;
        }

        // Check sum
        if (Math.abs(sumShares - totalAmount) > 0.01) {
          // Allowing small float precision variation
          if (parseFloat(sumShares.toFixed(2)) !== parseFloat(totalAmount.toFixed(2))) {
            throw new HttpException(400, `Total shares (${sumShares}) does not match total amount (${totalAmount}).`);
          }
        }
      }

      // verify all participants exist
      for (let i = 0; i < participants.length; i++) {
        const singleParticipant = participants[i];
        const userExists = await this.users.findById(singleParticipant.user);
        if (!userExists) throw new HttpException(404, `Participant ID ${singleParticipant.user} not found`);
      }

      // Save expense
      const dataToSave = {
        name,
        description,
        totalAmount,
        payer,
        splitType,
        participants: processedParticipants,
      };
      const newExpense = await this.expenses.create(dataToSave);

      // Update balances
      let promises = []; // For each participant (except payer), update the balance pair
      for (const singleParticipant of processedParticipants) {
        if (singleParticipant.user.toString() !== payer.toString()) {
          promises.push(this.updateBalancePair(singleParticipant.user.toString(), payer.toString(), singleParticipant.share));
        }
      }

      await Promise.all(promises);
      return newExpense;
    } catch (error) {
      throw error;
    }
  }

  public async findAllExpenses(): Promise<Expense[]> {
    const expenses = await this.expenses.find().populate('payer', 'name email').populate('participants.user', 'name email');
    return expenses;
  }

  public async deleteExpense(expenseId: string): Promise<Expense> {
    const expense = await this.expenses.findById(expenseId);
    if (!expense) throw new HttpException(404, 'Expense not found');
    if (expense.isDeleted) throw new HttpException(400, 'Expense already deleted');

    // Handle reverse Balance env flag logic
    const shouldReverse = true;

    if (shouldReverse) {
      let promises = []; // For each participant (except payer), reverse the balance pair
      for (const singleParticipant of expense.participants) {
        if (singleParticipant.user.toString() !== expense.payer.toString()) {
          promises.push(this.updateBalancePair(singleParticipant.user.toString(), expense.payer.toString(), -singleParticipant.share));
        }
      }
      await Promise.all(promises);
    }

    const deletedExpense = await this.expenses.findByIdAndUpdate(expenseId, { isDeleted: true });
    return deletedExpense || expense;
  }

  public async getBalances() {
    const balances = await this.balances.aggregate(this.getBalancesAggregate);   
    return balances.length ? balances : ['No balances found'];
  }

  public async getOptimizedSettlements() {
    const records = await this.balances.find().lean();

    // cAlculate  balance for each user
    const netBalances: Record<string, number> = {};

    for (const record of records) {
      const from = record.userFrom.toString();
      const to = record.userTo.toString();
      if (!netBalances[from]) netBalances[from] = 0;
      if (!netBalances[to]) netBalances[to] = 0;
      netBalances[from] -= record.amount;
      netBalances[to] += record.amount;
    }

    // Catogeries to Debtors and Creditors
    const debtors = [];
    const creditors = [];

    for (const [userId, amount] of Object.entries(netBalances)) {
      if (amount < -0.01) debtors.push({ userId, amount: Math.abs(amount) });
      else if (amount > 0.01) creditors.push({ userId, amount });
    }

    // Sort to optimize greedy algorithm
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    //  Two pointer greedy settlement
    const settlements = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor =creditors[c];

      const settlementAmount = Math.min(debtor.amount , creditor.amount);

      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: parseFloat(settlementAmount.toFixed(2)),
      });

      debtor.amount = debtor.amount - settlementAmount;
      creditor.amount = creditor.amount - settlementAmount;

      if (debtor.amount < 0.01){
        d++;
      } 

        
      if (creditor.amount < 0.01) {
         c++;
        }
    }

    // Replace user IDs with names for readability
    const formattedSettlements: { userFromName: string; userToName: string; amount: number }[] = [];
    for (const s of settlements) {
      const fromUser = await this.users.findById(s.from).select('name');
      const toUser = await this.users.findById(s.to).select('name');
      formattedSettlements.push({
        userFromName: fromUser?.name || s.from,
        userToName: toUser?.name || s.to,
        amount: s.amount
      });
    }

    return formattedSettlements.length ? formattedSettlements : ['All balances are settled'];
  }

  


  
  private async updateBalancePair(userA: string, userB: string, amountToAdd: number) {
    if (userA === userB) return;

    let userFrom: string;
    let userTo: string;
    let directionalAmount: number;

    // sorting to ensure unique indexes work correctly
    if (userA < userB) {
      userFrom = userA;
      userTo = userB;
      directionalAmount = amountToAdd;
    } else {
      userFrom = userB;
      userTo = userA;
      directionalAmount = -amountToAdd;
    }

    const fromUserName = await this.users.findById(userFrom).select('name');
    const toUserName = await this.users.findById(userTo).select('name');

    await this.balances.updateOne(
      { userFrom, userTo },
      {
        $inc: { amount: directionalAmount },
        $setOnInsert: {
          userFrom,
          userTo,
          userFromName: fromUserName?.name,
          userToName: toUserName?.name,
        },
      },
      { upsert: true },
    );
  }

  // Aggregate pipeline to get balances with user names
  private getBalancesAggregate = [
    {
      $match: {
        amount: { $ne: 0 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userFrom',
        foreignField: '_id',
        as: 'userFrom',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userTo',
        foreignField: '_id',
        as: 'userTo',
      },
    },
    {
      $unwind: '$userFrom',
    },
    {
      $unwind: '$userTo',
    },
    {
      $project: {
        userFromName: {
          $cond: {
            if: { $gt: ['$amount', 0] },
            then: '$userFrom.name',
            else: '$userTo.name',
          },
        },
       userToName : {
          $cond: {
            if: { $gt: ['$amount', 0] },
            then: '$userTo.name',
            else: '$userFrom.name',
          },
        },
        
        amount: { $abs: '$amount' },
      },
    },
  ];
}

export default ExpenseService;
