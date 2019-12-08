import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {FormGroup,FormControl,Validators} from '@angular/forms'
import {formatDate} from '@angular/common'
import {ToastrService} from 'ngx-toastr'
import {ActivatedRoute,Router} from '@angular/router'

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
userIdArray:String[]=[]
userNameArray:String[]=[]
membersArray:String[]=[]
membersuserIdArray:String[]=[]
groupForm=new FormGroup({
  name:new FormControl('',Validators.required),
  members:new FormControl('',Validators.required),
  date:new FormControl('')
})

  constructor(private appService:AppService,private toastr:ToastrService,private router:Router) {
    let todayDate=formatDate(new Date(),'yyyy-MM-dd','en-US')
    this.groupForm.get('date').setValue(todayDate)
   }

  ngOnInit() {
    this.appService.fetchUsers().subscribe(
      data=>{
        console.log(data.data)
        for(let item of data.data){
          if(item.userId!=window.sessionStorage.getItem('userId')){
          this.userIdArray.push(item.userId)
          this.userNameArray.push(item.firstName+" "+item.lastName)
        }
      }
      }
    )
  }

  onSubmit=()=>{
    this.membersuserIdArray.push(window.sessionStorage.getItem('userId'))
    let data={
      name:this.groupForm.get('name').value,
      members:this.membersuserIdArray,
      date:this.groupForm.get('date').value,  
    }
    this.appService.createGroup(data).subscribe(
      data=>{
       if(data.message=="Group Created Succesfully"){
         this.toastr.success(data.message)
         this.router.navigate(['/home'])
       }
       else{
         this.toastr.error(data.message)
       }
      }
    )
  }

  changeMembers=(event)=>{
    if(this.membersuserIdArray.indexOf(this.userIdArray[event.target.value])==-1){
      this.membersuserIdArray.push(this.userIdArray[event.target.value])
      this.membersArray.push(this.userNameArray[event.target.value])
      this.groupForm.get('members').setValue(this.membersArray)
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
