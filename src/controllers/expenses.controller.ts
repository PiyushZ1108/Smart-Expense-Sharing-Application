import { NextFunction, Request, Response } from 'express';
import { CreateExpenseDto } from '@dtos/expenses.dto';
import ExpenseService from '@services/expenses.service';

class ExpensesController {
  public expenseService = new ExpenseService();

  public createExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expenseData: CreateExpenseDto = req.body;
      const createExpenseData = await this.expenseService.createExpense(expenseData);

      res.status(201).json({ data: createExpenseData, message: 'Expense created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expenses = await this.expenseService.findAllExpenses();
      res.status(200).json({ data: expenses, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expenseId: string = req.params.id;
      const deletedExpense = await this.expenseService.deleteExpense(expenseId);

      res.status(200).json({ data: deletedExpense, message: 'Expense deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getBalances = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balances = await this.expenseService.getBalances();
      res.status(200).json({ data: balances, message: 'Current balances' });
    } catch (error) {
      next(error);
    }
  };

  public getOptimizedSettlements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settlements = await this.expenseService.getOptimizedSettlements();
      res.status(200).json({ data: settlements, message: 'Optimized settlements' });
    } catch (error) {
      next(error);
    }
  };
}

export default ExpensesController;
