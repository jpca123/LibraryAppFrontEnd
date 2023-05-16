import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private securityService: SecurityService;
  email: string = "";
  infoUser: string[] = [];
  constructor(securityServ: SecurityService) {
    this.securityService = securityServ;
  }

  ngOnInit(): void {
  }

  reset(){
    this.email = "";
  }
  send(){
    this.securityService.forgotPassword(this.email).subscribe((data: any)=>{
      console.log(data)
      if(data.ok)  this.infoUser = [data.message || "Email Enviado"];

    }, (err: any)=>{
      console.warn("fallo", err);
    }, this.reset);

    
  }

  cleanInfo(){
    this.infoUser = [];
  }
}
