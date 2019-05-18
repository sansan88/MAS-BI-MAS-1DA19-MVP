import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [

      { path: 'return', loadChildren: './../return/return.module#ReturnPageModule' },
      { path: 'profile', loadChildren: './../profile/profile.module#ProfilePageModule' },
      { path: 'welcome', loadChildren: './../welcome/welcome.module#WelcomePageModule' },
      { path: 'signature', loadChildren: './../signature/signature.module#SignaturePageModule' },
      { path: 'initiativen', loadChildren: './../initiativen/initiativen.module#InitiativenPageModule' },

      {
        path: '',
        redirectTo: '/app/welcome',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
