import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { TodosService } from '../service/todos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { ExpensesService } from '../service/expenses.service';

@Component({
  selector: 'app-todo-add-edit',
  templateUrl: './add-expenses.component.html',
  styleUrl: './add-expenses.component.css'
})
export class AddExpensesComponent implements OnInit{

  todoForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _expensesService: ExpensesService, 
    private _dialogRef: MatDialogRef<AddExpensesComponent>,
    private _coreSerivce: CoreService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    this.todoForm = this._fb.group({
      description: '',
      amount: '',
      modeOfPayment: '',
      subcategory: '',
      category: ''
    });
  }
  ngOnInit(): void {
    this.todoForm.patchValue(this.data);
  }

  onTodoFormSubmit() {
    if (this.todoForm.valid) {
      if(this.data){
        this._expensesService.updateExpenses(this.data.id, this.todoForm.value).subscribe({
          next: (val: any) => {
            this._coreSerivce.openSnackBar('Expense Updated!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });   
      }else{
        this._expensesService.addExpenses(this.todoForm.value).subscribe({
          next: (val: any) => {
            this._coreSerivce.openSnackBar('Expense Added!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

}
