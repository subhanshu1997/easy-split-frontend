import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http'
import {ToastrService} from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class AppService {
private url='http://localhost:3000/api/v1/easy-split'
//private url='http://api.my-app-dev.tk/api/v1/issue-tracking-tool'
auth='';
name=''
firstName:String
lastName:String
  constructor(private http:HttpClient,private toastr:ToastrService) { 
  }
  public signup=(data):any =>{
    return this.http.post(`${this.url}/signup`,data)
  }


  public signin=(data):any=>{
    let response:any=this.http.post(`${this.url}/login`,data)
    return response
  }

  public fetchGroups=():any=>{
    let data={
      authToken:window.sessionStorage.getItem('authToken'),
      userId:window.sessionStorage.getItem('userId')
    }
    return this.http.post(`${this.url}/fetchGroups`,data)
  }

  public fetchExpenses=(groupName:String):any=>{
    let data={
      authToken:window.sessionStorage.getItem('authToken'),
      groupName:groupName
    }
    return this.http.post(`${this.url}/fetchExpenses`,data)

  }

  public fetchUsers=():any=>{
    let data={
      authToken:window.sessionStorage.getItem('authToken')
    }
    return this.http.post(`${this.url}/fetchUsers`,data)
  }

  public fetchExpenseDetails=(expenseName:String,groupName:String):any=>{
    let data={
      authToken:window.sessionStorage.getItem('authToken'),
      expenseName:expenseName,
      groupName:groupName
    }
    return this.http.post(`${this.url}/fetchExpenseDetails`,data)
  }

  public editExpense=(data):any=>{
      data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/editExpense`,data)
  }

  public deleteExpense=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/deleteExpense`,data)
  }

  public createExpense=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/createExpense`,data)
  }

  public createGroup=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/createGroup`,data)
  }

  public updateExpenseHistory=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/updateExpenseHistory`,data)    
  }

  public fetchExpenseHistory=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/fetchExpenseHistory`,data)
  }

  public fetchGroupMembers=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/fetchGroupMembers`,data)
  }

  public logout=():any=>{
    let data={
    authToken:window.sessionStorage.getItem('authToken')}
    return this.http.post(`${this.url}/logout`,data)
  }



}
