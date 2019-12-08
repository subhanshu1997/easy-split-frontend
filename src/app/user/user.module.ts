import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component'

@NgModule({
  declarations: [SignupComponent, LoginComponent, HomeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent},
      {path:'sign-up',component:SignupComponent},
      {path:'home',component:HomeComponent}
    ])
  ]
})
export class UserModule { }
