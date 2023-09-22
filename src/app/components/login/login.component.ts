import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import UserLogin from 'src/app/models/Userlogin';
import { ShowInfoTypes } from 'src/app/models/types';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = "Login - Ingresa a tu perfil";
  user: UserLogin = {};
  InfoLoginEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>(); 

  private securityService: SecurityService;
  private router: Router;

  constructor(securityServ: SecurityService, router: Router) {
    this.securityService = securityServ;
    this.router = router;
  }

  ngOnInit(): void {
  }

  login(): void{
    let errors = this.validData();
    if(errors.length > 0) return this.InfoLoginEmitter.emit({type: ShowInfoTypes.ERROR, data: errors});

    this.securityService.login(this.user.userName!, this.user.password!).subscribe((data: any) =>{
      if(data.ok){
        let token: string = data.token as string;
        this.securityService.createSession(token);
        this.router.navigate(["/"]);
      }else this.InfoLoginEmitter.emit({type: ShowInfoTypes.ERROR, data: ["Falló la petición"]});
    }, 
    
    (err: any)=>{
      this.InfoLoginEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
      console.warn("Fallo login", err);
    })

  }

  validData(): string[]{
    let errors: string[] = [];
    if(!this.user.userName || !this.user.password) errors.push("El nombre de usuario y la contraseña son requeridos ") ;
    else{
      if(this.user.userName?.length < 5 || this.user.userName?.length > 80) errors.push("El nombre de usuario debe ser de entre 5 y 50 caracteres");
      if(this.user.password.length < 8 || this.user.password?.length > 30) errors.push("la contraseña debe ser de entre 6 y 15 caracteres");
    }
    return errors;
  }

  reset(){
    this.user = new User();
  }
}
