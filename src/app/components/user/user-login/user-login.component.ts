import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginForm!:FormGroup;
  message!:string;

  constructor(private fb:FormBuilder, private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  submitLogin(){
    console.log(this.loginForm)
    try {
      this.http.post("http://localhost:3000/api/login",this.loginForm.value).subscribe((res:any) => {
        localStorage.setItem('PROF', JSON.stringify(res['ResponseData']));
        this.message = res['ResponseText'];
        setTimeout(() => {
          this.router.navigate(['/user/messages'])
        }, 1500);

      }, (error) => {
        this.message = error.error.ResponseData
        let interval = setInterval(() => {
          clearInterval(interval)
          this.message = ''
        },1500)
      })
    } catch (error:any) {

    }
  }
}
