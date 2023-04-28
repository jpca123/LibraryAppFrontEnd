import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsComponent } from './components/authors/authors.component';
import { BooksComponent } from './components/books/books.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SessionValidatorGuard } from './guardians/session-validator.guard';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: "full"},
  {path: "books", component: BooksComponent, canActivate: [SessionValidatorGuard]},
  {path: "authors", component: AuthorsComponent,  canActivate: [SessionValidatorGuard]},
  {path: "categories", component: CategoriesComponent,  canActivate: [SessionValidatorGuard]},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgot-password", component: ForgotPasswordComponent},
  {path: "**", component: NotFoundComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
