import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  passwordConfirm: string;

  private securityService: SecurityService;
  private router: Router;

  constructor(securityServ: SecurityService, router: Router) {
    this.securityService = securityServ;
    this.router = router;
    this.passwordConfirm = "";
  }

  ngOnInit(): void {
  }

  register(){
    if(!this.validData()) return alert("informacion invalida");

    this.securityService.register(this.user).subscribe((data: any)=>{
      this.router.navigate(["/login"]);
    }, (err: any)=>{
      console.warn("fallo el registro de usuario", err);
      alert("Falló el registro, intentalo de nuevo");
    })
  }

  reset(){
    this.user = new User();
    this.passwordConfirm = "";
  }

  validData(): boolean{
    if(!this.user.userName) return false;
    if(!this.user.email) return false;
    if(!this.user.gender) return false;
    if(!this.user.password) return false;
    return true;
  }


}
