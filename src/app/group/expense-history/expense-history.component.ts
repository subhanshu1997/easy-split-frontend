import { Component, OnInit } from '@angular/core';
import{AppService} from '../../app.service'
import {Router,ActivatedRoute} from '@angular/router' 
import{ToastrService} from 'ngx-toastr'


@Component({
  selector: 'app-expense-history',
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css']
})
export class ExpenseHistoryComponent implements OnInit {

  constructor(private appService:AppService,private activatedRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) { }
  expenseHistory:String[]=[]
  expenseName:String=''
  groupName:String=''
  userIdArray:String[]=[]
  userNameArray:String[]=[]
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
      let expense={
        expenseName:this.expenseName,
        groupName:this.groupName
      }
      if(!this.expenseName!=undefined && this.groupName!=undefined){
        this.appService.fetchExpenseHistory(expense).subscribe(
          data=>{
            console.log("data"+data.data)
            for(let item of data.data){
            this.expenseHistory.push(item.update)
            }
            console.log("Items"+this.expenseHistory)
          }
        )
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
