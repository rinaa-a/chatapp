import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthtabsComponent } from '../components/authtabs/authtabs.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { AuthService } from '../services/auth.service';



@NgModule({
  declarations: [AuthtabsComponent, LoginComponent, SignupComponent],
  imports: [
    CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule
  ],
  exports: [
    AuthtabsComponent,
    LoginComponent,
    SignupComponent
  ],
  providers: [AuthService]
})
export class AuthModule { }
