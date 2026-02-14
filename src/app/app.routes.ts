import { Routes } from '@angular/router';
import { NewUser } from './pages/new-user/new-user';
import { Tweets } from './pages/tweets/tweets';
import { App } from './app';
export const routes: Routes = [
    {path: 'user',component:NewUser},
    {path:'*', component:App},
    {path:'tweets',component:Tweets}
];
