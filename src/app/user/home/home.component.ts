import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {Router} from '@angular/router'
import {ToastrService} from 'ngx-toastr'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  groups:String[]=[]
  private socketUrl='http://localhost:3000'
  socket
  constructor(private appService:AppService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.socket=io(this.socketUrl)
    this.socket.on(window.sessionStorage.getItem('userId'),(data)=>{
      this.toastr.info(data)
    })
    this.appService.fetchGroups().subscribe(
      data=>{
        this.groups=data.data
      }
    )
  }
  viewExpenses=(data)=>{
    this.router.navigate(['/expenses'],{queryParams:{"groupName":data}})
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
