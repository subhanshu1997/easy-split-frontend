import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import {AppService} from '../../app.service'
import {formatDate} from '@angular/common'
import {ToastrService} from 'ngx-toastr'


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  groupName:String=''
  expenses:any[]=[]
  userIdArray:String[]=[]
  userNameArray:String[]=[]
  constructor(private activatedRoute:ActivatedRoute,private router:Router,private appService:AppService,private toastr:ToastrService) { }

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
        this.groupName=data['groupName']
        if(!this.groupName!=undefined){
          this.fetchExpenses()
        }
      }
    )
  }
  fetchExpenses=()=>{
    this.appService.fetchExpenses(this.groupName).subscribe(
      data=>{
        this.expenses=data.data
        for(let item of this.expenses){
          item.dateOfCreation=formatDate(item.dateOfCreation,'yyyy-MM-dd','en-US')
          item.createdBy=this.userNameArray[this.userIdArray.indexOf(item.createdBy)]
        }
      }
    )  
  }

  viewExpense=(i)=>{
    this.router.navigate(['/view-expense'],{queryParams:{"expenseName":i.name,"groupName":i.group}})
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
