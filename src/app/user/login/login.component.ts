import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import{Router} from '@angular/router'
import{ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm=new FormGroup({
  username:new FormControl('',Validators.required),
  password:new FormControl('',Validators.required)
})
  constructor(private appService:AppService,private toastr:ToastrService,private router:Router) { }

  ngOnInit() {
  }
errormessage:String=''
status=false
  login=()=>{
    let data={
      userName:this.loginForm.get('username').value,
      password:this.loginForm.get('password').value
    }
    this.appService.signin(data).subscribe(
      data=>{
        if(data.message=='Invalid Username Or Password'){
        this.toastr.error(data.message)      
      }
        else{
        window.sessionStorage.setItem('authToken',data.data.authToken)
        window.sessionStorage.setItem('name',data.data.userDetails.firstName+" "+data.data.userDetails.lastName)
        window.sessionStorage.setItem('userId',data.data.userDetails.userId)
          this.status=false
          this.router.navigate(['/home'])
          this.toastr.success(data.message)
        }
      }
    )

  }

}
