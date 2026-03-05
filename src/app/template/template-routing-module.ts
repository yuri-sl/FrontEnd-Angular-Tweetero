import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';

const routes: Routes = [
  {
    path:'',
    component:Layout,
    children:[
      {
        path:'tweets',
        loadChildren: () => import('../pages/tweets/tweets').then(m => m.Tweets),
        pathMatch:'full'
      },
      {
        path:'profile',
        loadChildren: () => import('../pages/tweets/user-profile/user-profile').then(m=> m.UserProfile),
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule {
}
