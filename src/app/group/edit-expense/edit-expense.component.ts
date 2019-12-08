import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {FormGroup,FormControl,Validators} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {DatePipe} from '@angular/common'
import {ToastrService} from 'ngx-toastr'
import {Router} from '@angular/router'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css']
})
export class EditExpenseComponent implements OnInit {
  private socketUrl='http://localhost:3000'
  userIdArray:String[]=[]
  userNameArray:String[]=[]
  userIdSelectArray:String[]=[]
  userNameSelectArray:String[]=[]
  expenseName:String=''
  groupName:String=''
  membersArray:String[]=[]
  paidMembersArray:String[]=[]
  membersuserIdArray:String[]=[]
  paidMembersuserIdArray:String[]=[]
  updatesArray:String[]=[]
  originalData:any
  originalMembers:String[]=[]
  originalPaidMembers:String[]=[]
  createdBy:String=''
  expenseMembers:String[]=[]
  paidMembersUsernameSelect:String[]=[]
  paidMembersUserIdSelect:String[]=[]
  socket
  expenseForm=new FormGroup({
    name:new FormControl('',Validators.required),
    amount:new FormControl('',Validators.required),
    members:new FormControl('',Validators.required),
    date:new FormControl(''),
    paidMembers:new FormControl('')
  })


  constructor(private appService:AppService,private activatedRoute:ActivatedRoute,private datePipe:DatePipe,private router:Router,private toastr:ToastrService) {
    this.socket=io(this.socketUrl)
   }

  ngOnInit() {
    console.log("Called")
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
      expenseData=>{
        this.originalData=expenseData.data
        this.expenseMembers=expenseData.data.members
        console.log("Original Data"+this.originalData.members)
        for(let item of this.userIdArray){
          if(item!=expenseData.data.createdBy){
            this.userIdSelectArray.push(item)
            this.userNameSelectArray.push(this.userNameArray[this.userIdArray.indexOf(item)])
          }
        }
        this.originalMembers=this.originalData.members
        this.expenseForm.get('name').setValue(expenseData.data.name)
        this.expenseForm.get('amount').setValue(expenseData.data.amount)
        for(let item of expenseData.data.members){
          this.membersArray.push(this.userNameArray[this.userIdArray.indexOf(item)])
        }
        this.membersuserIdArray=expenseData.data.members
        this.expenseForm.get('members').setValue(this.membersArray)
        for(let item of expenseData.data.membersPaid){
          this.paidMembersArray.push(this.userNameArray[this.userIdArray.indexOf(item)])
        }
        this.paidMembersuserIdArray=expenseData.data.membersPaid
        this.expenseForm.get('paidMembers').setValue(this.paidMembersArray)
        this.expenseForm.get('date').setValue(expenseData.data.dateOfCreation.substring(0,10))
      }
    )
  }

  onSubmit=()=>{
    let data={
      name:this.expenseForm.get('name').value,
      amount:this.expenseForm.get('amount').value,
      members:this.membersuserIdArray,
      membersPaid:this.paidMembersuserIdArray,
      date:this.expenseForm.get('date').value,
      groupName:this.groupName
    }
    console.log("Paid Members"+data.membersPaid)
    this.appService.editExpense(data).subscribe(
      data=>{
        console.log("Original Members"+this.originalMembers)
        if(data.message=="Expense Edited Successfully"){
          this.toastr.success("Expense Edited Successfully")
          this.router.navigate(['/home'])
        }
        else{
          this.toastr.error(data.message)
        }
      }
    )
    if(this.originalData.name!=data.name){
      this.updatesArray.push("Name of expense with name "+this.originalData.name+" has been changed to "+data.name)
      let socketData={
        expenseName:this.expenseName,
        members:this.expenseMembers,
        action:"update-expense",
        message:"Name of expense with name "+this.originalData.name+" has been changed to "+data.name
      }
      this.socket.emit(socketData.action,socketData)
    }
    if(this.originalData.amount!=data.amount){
      this.updatesArray.push("Amount of expense with name "+this.originalData.name+" has been changed to "+data.amount)
      let socketData={
        expenseName:this.expenseName,
        members:this.expenseMembers,
        action:"update-expense",
        message:"Amount of expense with name "+this.originalData.name+" has been changed to "+data.amount
      }
      this.socket.emit(socketData.action,socketData)
    }
    if(this.originalData.date!=data.date){
      this.updatesArray.push("Date of expense with name "+this.originalData.name+" has been changed to "+data.date)
      let socketData={
        expenseName:this.expenseName,
        members:this.expenseMembers,
        action:"update-expense",
        userId:window.sessionStorage.getItem('userId'),
        message:"Date of expense with name "+this.originalData.name+" has been changed to "+data.date
      }
      this.socket.emit(socketData.action,socketData)
    }
    // for(let item of this.originalData.members){
    //   console.log(this.originalData.members)
    //   console.log(data.members)
    //   if(data.members.indexOf(item)==-1){
    //     console.log(item)
    //     this.updatesArray.push("User with name "+this.userNameArray[this.userIdArray.indexOf(item)]+" has been removed from expense "+this.expenseName)
    //   }
    // }
    // for(let item of data.members){
    //   if(this.originalData.members.indexOf(item)==-1){
    //     this.updatesArray.push("User with name "+this.userNameArray[this.userIdArray.indexOf(item)]+" has been added to expense "+this.expenseName)
    //   }
    // }
    let updatedData={
      name:this.expenseName,
      group:this.groupName,
      updatesArray:this.updatesArray
    }
    this.appService.updateExpenseHistory(updatedData).subscribe(
      data=>{
        // console.log("Updates"+data.data.update)
      }
    )
  }

  changeMembers=(event)=>{
    if(this.membersuserIdArray.indexOf(this.userIdSelectArray[event.target.value])==-1){
      this.membersuserIdArray.push(this.userIdSelectArray[event.target.value])
      this.membersArray.push(this.userNameSelectArray[event.target.value])
      //this.paidMembersUsernameSelect.push(this.userNameArray[event.target.value])
      //this.paidMembersUserIdSelect.push(this.userIdArray[event.target.value])
      this.expenseForm.get('members').setValue(this.membersArray)
    }else{
      let userId=this.userIdSelectArray[event.target.value]
      let userName=this.userNameSelectArray[event.target.value]
      this.membersuserIdArray.splice(this.membersuserIdArray.indexOf(userId),1)
      this.membersArray.splice(this.membersArray.indexOf(userName),1)
      //this.paidMembersUserIdSelect.splice(this.membersuserIdArray.indexOf(userId),1)
      //this.paidMembersUsernameSelect.splice(this.membersArray.indexOf(userName),1)
      this.expenseForm.get('members').setValue(this.membersArray)
    }
    
  }

  changePaidMembers=(event)=>{
    if(this.paidMembersuserIdArray.indexOf(this.userIdSelectArray[event.target.value])==-1){
      this.paidMembersuserIdArray.push(this.userIdSelectArray[event.target.value])
      this.paidMembersArray.push(this.userNameSelectArray[event.target.value])
      this.expenseForm.get('paidMembers').setValue(this.paidMembersArray)
      console.log("Members"+this.paidMembersuserIdArray)
    }
    else{
      let userId=this.userIdSelectArray[event.target.value]
      let userName=this.userNameSelectArray[event.target.value]
      this.paidMembersuserIdArray.splice(this.paidMembersuserIdArray.indexOf(userId),1)
      this.paidMembersArray.splice(this.paidMembersArray.indexOf(userName),1)
      this.expenseForm.get('paidMembers').setValue(this.paidMembersArray)
    }
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
