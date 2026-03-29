import { Routes } from '@angular/router';
import { NewUser } from './pages/new-user/new-user';
import { Tweets } from './pages/tweets/tweets';
import { UserProfile } from './pages/tweets/user-profile/user-profile';
import { Layout } from './template/layout/layout';
import { Search } from './pages/search/search';
import { Notifications } from './pages/notifications/notifications';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'user', component: NewUser },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tweets', pathMatch: 'full' },
      { path: 'tweets', component: Tweets },
      { path: 'user/profile/:userId', component: UserProfile },
      { path: 'buscar', component: Search },
      { path: 'notificacoes', component: Notifications },
    ],
  },
  { path: '**', component: NotFound },
];
