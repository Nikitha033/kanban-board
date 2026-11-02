import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { DashboardComponent } from './components/dashboard/dashboard';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './contact/contact';





export const routes: Routes = [

{ path: '', redirectTo: 'login', pathMatch: 'full' },

{ path: 'login', component: LoginComponent },

{ path: 'signup', component: SignupComponent },

{ path: 'home', component: HomeComponent },

{ path: 'dashboard', component: DashboardComponent },

{ path: 'kanban', component: KanbanBoardComponent },
{ path: 'about', component: AboutComponent },
{ path: 'contact', component: ContactComponent },


];
