import { Routes } from '@angular/router';
import { NewUser } from './pages/new-user/new-user';
import { Tweets } from './pages/tweets/tweets';
import { App } from './app';
import { UserProfile } from './pages/tweets/user-profile/user-profile';
export const routes: Routes = [
    {path: 'user',pathMatch:'prefix',component:NewUser},
    {path:'',pathMatch:'full',redirectTo:'user'},
    {path:'tweets',component:Tweets},
    {path:'user/profile/:userId',component:UserProfile}
];
