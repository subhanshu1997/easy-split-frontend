import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {ActivatedRoute,Router} from '@angular/router'
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-pending-amount',
  templateUrl: './pending-amount.component.html',
  styleUrls: ['./pending-amount.component.css']
})
export class PendingAmountComponent implements OnInit {
  expenseName:String=''
  groupName:String=''
  createdBy:String=''
  members:String[]=[]
  membersName:String[]=[]
  amount:number=0
  total:number=0
  userIdArray:String[]=[]
  userNameArray:String[]=[]
  allUsers:any
  constructor(private appService:AppService,private activatedRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) { }
  ngOnInit() {
    this.appService.fetchUsers().subscribe(
      data=>{
        this.allUsers=data.data
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
        this.total=data.data.amount
        this.amount=this.total/data.data.members.length
        this.createdBy=this.userNameArray[this.userIdArray.indexOf(data.data.createdBy)]
        this.members=data.data.members
        this.members.splice(this.members.indexOf(data.data.createdBy),1)
        if(data.data.membersPaid.length!=0){
        for(let item of data.data.membersPaid){
          this.members.splice(this.members.indexOf(item),1)
        }
      }
        for(let item of this.members){
          for(let userName of this.allUsers){
            if(userName.userId==item){
              this.membersName.push(userName.firstName+" "+userName.lastName)
            }
          }
        }        
      }
    )
  }

  createExpense=()=>{
    this.router.navigate(['/create-expense'],{queryParams:{"groupName":this.groupName}})
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
