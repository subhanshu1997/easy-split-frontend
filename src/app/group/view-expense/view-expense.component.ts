import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl} from '@angular/forms'
import {ActivatedRoute,Router} from '@angular/router'
import {AppService} from '../../app.service'
import {DatePipe} from '@angular/common'
import {ToastrService} from 'ngx-toastr'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.css']
})
export class ViewExpenseComponent implements OnInit {
  expenseForm=new FormGroup({
    name:new FormControl(''),
    amount:new FormControl(''),
    members:new FormControl(''),
    date:new FormControl(''),
    paidMembers:new FormControl(''),
    createdBy:new FormControl('')
  })
  private socketUrl='http://localhost:3000'
  expenseName:String=''
  groupName:String=''
  membersFetched:String[]=[]
  paidMembersFetched:String[]=[]
  userIdArray:String[]=[]
  userNameArray:String[]=[]
  expenseMembers:String[]=[]
  socket
  constructor(private activatedRoute:ActivatedRoute,private toastr:ToastrService,private router:Router,private datePipe:DatePipe,private appService:AppService) {
    this.socket=io(this.socketUrl)
   }

  ngOnInit() {
    this.appService.fetchUsers().subscribe(
      data=>{
        for(let item of data.data){
          this.userIdArray.push(item.userId)
          this.userNameArray.push(item.firstName+" "+item.lastName)
        }
      }
    )
    this.activatedRoute.queryParams.subscribe(
      data=>{
        this.expenseName=data['expenseName']
        this.groupName=data['groupName']
        if(!this.expenseName!=undefined && this.groupName!=undefined){
          this.fetchExpenseDetails()
        }
      }
    )
  }

  fetchExpenseDetails=()=>{
    this.appService.fetchExpenseDetails(this.expenseName,this.groupName).subscribe(
      data=>{
        this.expenseForm.get('name').setValue(data.data.name)
        this.expenseForm.get('amount').setValue(data.data.amount)
        this.expenseMembers=data.data.members
        for(let item of data.data.members){
          this.membersFetched.push(this.userNameArray[this.userIdArray.indexOf(item)])
        }
        this.expenseForm.get('members').setValue(this.membersFetched)
        for(let item of data.data.membersPaid){
          this.paidMembersFetched.push(this.userNameArray[this.userIdArray.indexOf(item)])
        }
        this.expenseForm.get('paidMembers').setValue(this.paidMembersFetched)
        this.expenseForm.get('createdBy').setValue(this.userNameArray[this.userIdArray.indexOf(data.data.createdBy)])
        console.log((data.data.dateOfCreation.substring(0,10)))
        this.expenseForm.get('date').setValue(data.data.dateOfCreation.substring(0,10))
      }
    )
  }

  editExpense=()=>{
    this.router.navigate(['/edit-expense'],{queryParams:{"expenseName":this.expenseName,"groupName":this.groupName}})
  }

  viewExpenseHistory=()=>{
    this.router.navigate(['/expense-history'],{queryParams:{"expenseName":this.expenseName,"groupName":this.groupName}})
  }

  viewPendingAmount=()=>{
    this.router.navigate(['/pending-amount'],{queryParams:{"expenseName":this.expenseName,"groupName":this.groupName}})
  }

  createExpense=()=>{
    this.router.navigate(['/create-expense'],{queryParams:{"groupName":this.groupName}})
  }

  deleteExpense=()=>{
    let data={
      expenseName:this.expenseName,
      groupName:this.groupName
    }
    this.appService.deleteExpense(data).subscribe(
      data=>{
        console.log(data.data)
        if(data.message=="Expense Deleted Successfully"){
          this.toastr.success(data.message)
          let socketData={
            expenseName:this.expenseName,
            members:this.expenseMembers,
            userId:window.sessionStorage.getItem('userId'),
            action:"delete-expense"
          }
          this.socket.emit(socketData.action,socketData)
          this.router.navigate(['/expenses'],{queryParams:{"groupName":this.groupName}})
        }
        else{
          this.toastr.error(data.message)
        }
      }
    )
  }

  logout=()=>{
    this.appService.logout().subscribe(
      data=>{
        if(data.message="Logged Out Successfully"){
          window.sessionStorage.clear()
          this.toastr.success(data.message)
          this.router.navigate(['/login'])
      }
      else{
        this.toastr.error(data.message)
      }
  })
  }

}
