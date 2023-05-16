import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private securityService: SecurityService;
  private router: Router;
  session: boolean = false;
  sessionSubscription = new Subscription();

  constructor(securityService: SecurityService, router: Router) {
    this.securityService = securityService;
    this.router = router;

    this.sessionSubscription = securityService.getSessionObserver().subscribe(data => {
      this.session = data;

    })

  }

  logout() {
    this.securityService.logout().subscribe((data: any) => {
      if(data.ok) return;
      else console.warn('Sesion cerrada con error', data)
    }, (err: any) => {
      console.warn("No se pudo cerrar session, al parecer no hay una sesion activa", err)
    }, ()=> this.router.navigate(["/login"]))


  }

  ngOnInit(): void {

  }

}
