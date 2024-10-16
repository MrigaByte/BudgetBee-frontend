import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { TodoAddEditComponent } from './todo-add-edit/todo-add-edit.component';
// import { TodosService } from './service/todos.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ExpensesService } from './service/expenses.service';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit{
  displayedColumns: string[] = ['id', 'description', 'amount', 'category','subcategory','category', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _dialog: MatDialog, 
    private _expensesService: ExpensesService,
    private _coreSerivce: CoreService,
  ){}
  
  ngOnInit(): void {
    this.getAllTodos();
    this.loadExpenses();
  }

  openAddEditTodoForm(){
    const dialogRef=this._dialog.open(AddExpensesComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val){
          this.getAllTodos();
        }
      }
    });
  }

  getAllTodos(){
    console.log('inside getAllTodos');
    this._expensesService.getAllExpenses().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loadExpenses();
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteTodo(id:number){
    console.log("Inside main function of delete");
    this._expensesService.deleteExpense(id).subscribe({
      next: (res) => {
        console.log("Inside next");
        console.log(res);
        this._coreSerivce.openSnackBar('Todos Deleted!', 'done');
        this.getAllTodos();
        console.log("called getall todos");
      },
      error: (e) =>{
        console.log('Inside error of delete');
        console.log(e);
    }});
  }

  openEditTodoForm(data: any){
    const dialogRef=this._dialog.open(AddExpensesComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val){
          this.getAllTodos();
        }
      }
    });
  }

  expenses: any[] = [];  // Using 'any[]' without a model

  totalNeeds: number = 0;
  totalSavings: number = 0;
  totalWants: number = 0;

  // constructor() { }

  // ngOnInit(): void {
    
  // }

  loadExpenses() {
    this._expensesService.getAllExpenses().subscribe((data: any[]) => {
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
