import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import UserLogin from 'src/app/models/Userlogin';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserLogin = {};
  private securityService: SecurityService;
  private router: Router;

  constructor(securityServ: SecurityService, router: Router) {
    this.securityService = securityServ;
    this.router = router;
  }

  ngOnInit(): void {
  }

  login(): void{
    if(!this.validData()) return;

    this.securityService.login(this.user.userName!, this.user.password!).subscribe((data: any) =>{
      let token: string = data.token as string;
      this.securityService.createSession(token);
      this.router.navigate(["/"]);
    }, (err: any)=>{
      alert("fallo el login");
      console.warn("Fallo login", err);
    })

  }

  validData(): boolean{
    if(!this.user.userName || !this.user.password) return false;

    if(this.user.userName?.length > 80) return false;

    if(this.user.password.length < 8 && this.user.password?.length > 30) return false;

    return true;
  }

  reset(){
    this.user = new User();
  }
}
