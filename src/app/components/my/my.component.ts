import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/models/User';
import { ShowInfoTypes } from 'src/app/models/types';
import { SecurityService } from 'src/app/services/security.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.css']
})
export class MyComponent implements OnInit {

  user = new User();
  userUpdate = new User();
  passwordConfirm = "";
  InfoUserEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();
  InfoGeneralEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();
  

  constructor(
    private userService: UserService,
    private securityService: SecurityService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.userService.get().subscribe((data: any) => {
      if(data.ok){
        this.user = data.data;
        this.userUpdate = data.data
      }
      else this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR, data: ["fallo la obtencion del usuario"]})
    }, (err: any)=>{
      console.warn("fallo getData", err);
      this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  ngOnSubmitUpdate(event: any){
    let errors = this.validData();
    if(errors.length > 0) return this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR ,data: errors});

    this.userService.update(this.userUpdate).subscribe((data: any)=>{
      if(data.ok){
        this.getData();
      }else this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR, data: ["Fallo la actualización de la informacíon"]})
    }, (err: any)=>{
      console.warn("fallo update", err);
      this.InfoUserEmitter.emit(err.error.errors.map((el: any)=> el.message));
    })
  }

  closeSession(){
    this.securityService.logout()
  }

  deleteAccount(){
    this.userService.delete().subscribe((data: any)=>{
      if(data.ok){
        this.securityService.logout()
      } else this.InfoGeneralEmitter.emit({type: ShowInfoTypes.ERROR, data: ["Fallo la eliminación de la cuenta"]})
    }, (err: any)=>{
      console.warn("fallo update", err);
      this.InfoGeneralEmitter.emit(err.error.errors.map((el: any)=> el.message));
    })
  }
  
  reset(){
    this.userUpdate = new User();
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
    // if(!this.user.password) errors.push("El campo password es requerido");
    // else {
    //   if (this.user.password !== this.passwordConfirm) errors.push("Las contraseñas no coinciden");
    //   if(this.user.password.length < 8 || this.passwordConfirm.length > 50) errors.push("La contraseña debe ser de entre 8 y 15 caracteres");
    // }
    return errors;
  }

}
