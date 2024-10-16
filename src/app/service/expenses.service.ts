import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  targetUrl:string='http://localhost:8080/api/users/5/expenses';

  constructor(private _http:HttpClient) { }

  addExpenses(data: any): Observable<any>{
    return this._http.post(this.targetUrl, data);
  }

  getAllExpenses(): Observable<any[]> {
    return this._http.get<any[]>(this.targetUrl);
  }

  // getAllExpenses(): Observable<Expense[]>{
  //   return this._http.get<Expense[]>(this.targetUrl);
  // }

  updateExpenses(id:number, data: any): Observable<any>{
    let user =data['user'];
    return this._http.put(this.targetUrl+'/user/'+user+'/'+id, data);
  }

  deleteExpense(id: number): Observable<any>{
    return this._http.delete(this.targetUrl+'/'+id);
  }
}
