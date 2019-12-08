import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators, FormControl} from '@angular/forms'
import { AppService } from 'src/app/app.service';
import{ToastrService, Toast} from 'ngx-toastr'
import{HttpClient} from '@angular/common/http'
import{Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private appService:AppService,private toastr:ToastrService,private router:Router) { }
  registerForm=new FormGroup({
    firstname:new FormControl('',Validators.required),
    lastname:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required]),
    username:new FormControl('',Validators.required),
    mobileno:new FormControl('',[Validators.required,Validators.min(1000000000),Validators.max(9999999999)]),
    countrycode:new FormControl('')

  })
  ngOnInit() {
    this.registerForm.get('countrycode').setValue("+213")
  }
  signup=()=>{
    let countrycode:String
    if(!this.registerForm.get('countrycode').value){
      countrycode="+213"
    }
    else{
      countrycode=this.registerForm.get('countrycode').value
    }
    let data={
      firstName:this.registerForm.get('firstname').value,
      lastName:this.registerForm.get('lastname').value,
      email:this.registerForm.get('email').value,
      password:this.registerForm.get('password').value,
      userName:this.registerForm.get('username').value,
      mobileNumber:countrycode+this.registerForm.get('mobileno').value
    }
    this.appService.signup(data).subscribe(
      data=>{
        if(data.message=='User Cannot Be Created.User Already Present'){
          this.toastr.error(data.message)
        }
        else if(data.message=='Failed To Create User'){
          this.toastr.error(data.message)
        }
        else if(data.message=='User created'){
          this.toastr.success("Signed Up Successfully")
        this.router.navigate(['/login'])}
      }
    )
  }
}
