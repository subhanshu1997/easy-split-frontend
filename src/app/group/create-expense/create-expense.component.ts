import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {FormGroup,FormControl,Validators} from '@angular/forms'
import {formatDate} from '@angular/common'
import {ToastrService} from 'ngx-toastr'
import {ActivatedRoute,Router} from '@angular/router'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css']
})
export class CreateExpenseComponent implements OnInit {
socket
userIdArray:String[]=[]
userNameArray:String[]=[]
groupName:String=''
membersArray:String[]=[]
paidMembersArray:String[]=[]
membersuserIdArray:String[]=[]
paidMembersuserIdArray:String[]=[]
paidMembersUsernameSelect:String[]=[]
paidMembersUserIdSelect:String[]=[]
updatesArray:String[]=[]
private socketUrl='http://localhost:3000'
expenseForm=new FormGroup({
  name:new FormControl('',Validators.required),
  amount:new FormControl('',Validators.required),
  members:new FormControl('',Validators.required),
  date:new FormControl(),
  paidMembers:new FormControl('')
})
  constructor(private appService:AppService,private toastr:ToastrService,private activatedRoute:ActivatedRoute,private router:Router) {
    this.socket=io(this.socketUrl)
    let todayDate=formatDate(new Date(),'yyyy-MM-dd','en-US')
    this.expenseForm.get('date').setValue(todayDate)
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      data=>{
        this.groupName=data['groupName']
      }
    )
    let data={
      groupName:this.groupName
    }
    this.appService.fetchGroupMembers(data).subscribe(
      groupMembers=>{
        console.log("Group Members"+groupMembers.data)
    this.appService.fetchUsers().subscribe(
      data=>{
        for(let item of data.data){
          if(groupMembers.data.indexOf(item.userId)!=-1){
          if(item.userId!=window.sessionStorage.getItem('userId')){
            this.userIdArray.push(item.userId)
            this.userNameArray.push(item.firstName+" "+item.lastName)
          }
        }
        }
      }
    )})
  }

  onSubmit=()=>{
    this.membersuserIdArray.push(window.sessionStorage.getItem('userId'))
    let data={
      name:this.expenseForm.get('name').value,
      amount:this.expenseForm.get('amount').value,
      members:this.membersuserIdArray,
      date:this.expenseForm.get('date').value,
      membersPaid:this.paidMembersuserIdArray,
      group:this.groupName,
      createdBy:window.sessionStorage.getItem('userId')   
    }
    this.appService.createExpense(data).subscribe(
      data=>{
        if(data.message=="Expense Created Succesfully"){
          this.toastr.success(data.message)
          this.updatesArray.push(window.sessionStorage.getItem('name')+" created this expense.")
          let updatedData={
            name:data.data.name,
            group:data.data.group,
            updatesArray:this.updatesArray
          }
          this.appService.updateExpenseHistory(updatedData).subscribe(
            data=>{
              console.log(data)
            }
          )
      this.router.navigate(['/expenses'],{queryParams:{"groupName":this.groupName}})
        }
        else{
          this.toastr.error(data.message)
        }
      }
    )
    let socketDataMembers=data.members
    let socketDataName=data.name
    let socketData={
      expenseName:socketDataName,
      members:socketDataMembers,
      action:"create-expense"
    }
    this.socket.emit(socketData.action,socketData)
  }

  changeMembers=(event)=>{
    if(this.membersuserIdArray.indexOf(this.userIdArray[event.target.value])==-1){
      this.membersuserIdArray.push(this.userIdArray[event.target.value])
      this.membersArray.push(this.userNameArray[event.target.value])
      this.paidMembersUsernameSelect.push(this.userNameArray[event.target.value])
      this.paidMembersUserIdSelect.push(this.userIdArray[event.target.value])
      this.expenseForm.get('members').setValue(this.membersArray)
    }
    else{
      let userId=this.userIdArray[event.target.value]
      let userName=this.userNameArray[event.target.value]
      this.membersuserIdArray.splice(this.membersuserIdArray.indexOf(userId),1)
      this.membersArray.splice(this.membersArray.indexOf(userName),1)
      this.paidMembersUserIdSelect.splice(this.membersuserIdArray.indexOf(userId),1)
      this.paidMembersUsernameSelect.splice(this.membersArray.indexOf(userName),1)
      this.expenseForm.get('members').setValue(this.membersArray)
    }
    
  }

  changePaidMembers=(event)=>{
    if(this.paidMembersuserIdArray.indexOf(this.paidMembersUserIdSelect[event.target.value])==-1){
      this.paidMembersuserIdArray.push(this.paidMembersUserIdSelect[event.target.value])
      this.paidMembersArray.push(this.paidMembersUsernameSelect[event.target.value])
      this.expenseForm.get('paidMembers').setValue(this.paidMembersArray)
    }
    else{
      let userId=this.paidMembersUserIdSelect[event.target.value]
      let userName=this.paidMembersUsernameSelect[event.target.value]
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
