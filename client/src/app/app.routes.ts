import { Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list';
import { PostDetailComponent } from './pages/post-detail';
import { LoginComponent } from './pages/login';
import { RegisterComponent } from './pages/register';
import { NewPostComponent } from './pages/new-post';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-post', component: NewPostComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
