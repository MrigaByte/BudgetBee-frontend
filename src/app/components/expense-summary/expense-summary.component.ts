import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../service/expenses.service';
// import { ExpensesService } from './service/expenses.service';

@Component({
  selector: 'app-expense-summary',
  templateUrl: './expense-summary.component.html',
  styleUrls: ['./expense-summary.component.css']
})
export class ExpenseSummaryComponent implements OnInit {

  expenses: any[] = [];  // No model used, just 'any[]'

  totalNeeds: number = 0;
  totalSavings: number = 0;
  totalWants: number = 0;

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expensesService.getAllExpenses().subscribe((data: any[]) => {
      this.expenses = data;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalNeeds = this.calculateTotalByCategory('Needs');
    this.totalSavings = this.calculateTotalByCategory('Savings');
    this.totalWants = this.calculateTotalByCategory('Wants');
  }

  calculateTotalByCategory(category: string): number {
    return this.expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }
}
