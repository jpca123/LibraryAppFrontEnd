import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import { ShowInfoTypes } from 'src/app/models/types';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User();
  passwordConfirm = "";
  InfoRegisterEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();

  private securityService: SecurityService;
  private router: Router;

  constructor(securityServ: SecurityService, router: Router) {
    this.securityService = securityServ;
    this.router = router;
  }

  register(){
    let errors = this.validData();
    if(errors.length > 0 ) return this.InfoRegisterEmitter.emit({type: ShowInfoTypes.ERROR, data: errors});

    this.securityService.register(this.user).subscribe((data: any) =>{
      console.log({data})
      if(data.ok) {
        this.router.navigate(["/login"]);
        this.InfoRegisterEmitter.emit({type: ShowInfoTypes.SUCCESS, data: ["Se registro con exito, espere un momento..."]});
      }
      else this.InfoRegisterEmitter.emit({type: ShowInfoTypes.ERROR, data: ["No se pudo realizar el registro"]});
    }, 
    (err: any)=>{
      console.warn("fallo el registro de usuario", err);
      this.InfoRegisterEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  reset(){
    this.user = new User();
    this.passwordConfirm = "";
  }

  validData(): string[]{
    let errors: string[] = [];
    if(!this.user.userName) errors.push("El campo userName es requerido");
    else{
      if(this.user.userName.length < 5 || this.user.userName.length > 50) errors.push("El nombre de usuario debe ser de entre 5 y 50 caracteres");
    }
    if(!this.user.name) errors.push("El campo name es requerido");
    else{
      if(this.user.name.length < 5 || this.user.name.length > 50) errors.push("El nombre debe ser de entre 5 y 50 caracteres");
    }
    if(this.user.lastName){
      if(this.user.lastName.length < 5 || this.user.lastName.length > 50) errors.push("El apellido debe ser de entre 5 y 50 caracteres, ademas es opcional");
    }
    if(!this.user.email) errors.push("El campo email es requerido");
    if(!this.user.gender) errors.push("El campo gender es requerido");
    if(!this.user.password) errors.push("El campo password es requerido");
    else {
      if (this.user.password !== this.passwordConfirm) errors.push("Las contraseñas no coinciden");
      if(this.user.password.length < 8 || this.passwordConfirm.length > 50) errors.push("La contraseña debe ser de entre 8 y 15 caracteres");
    }
    return errors;
  }


}
