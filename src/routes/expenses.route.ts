import { Router } from 'express';
import ExpensesController from '@controllers/expenses.controller';
import { CreateExpenseDto } from '@dtos/expenses.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class ExpensesRoute implements Routes {
  public path = '/expenses';
  public router = Router();
  public expensesController = new ExpensesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.expensesController.getExpenses); 
    this.router.post(`${this.path}/create`, validationMiddleware(CreateExpenseDto, 'body'), this.expensesController.createExpense); 
    this.router.delete(`${this.path}/:id`, this.expensesController.deleteExpense);
 
    this.router.get(`${this.path}/balances`, this.expensesController.getBalances); 
    this.router.get(`${this.path}/settlements`, this.expensesController.getOptimizedSettlements);
  }
}

export default ExpensesRoute;
