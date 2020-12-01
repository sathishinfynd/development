import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'quick-search',
        pathMatch: 'full'
      },
      {
        path: 'quick-search',
        loadChildren: './pages/quick-search/quick-search.module#QuickSearchModule',
        canActivate: [AuthGuard]
      },
      { path: 'company-search', loadChildren: () => import('./pages/company-search/company-search.module').then(m => m.CompanySearchModule), canActivate: [AuthGuard] },
      { path: 'people-search', loadChildren: () => import('./pages/people-search/people-search.module').then(m => m.PeopleSearchModule), canActivate: [AuthGuard] },
      { path: 'investment-search', loadChildren: () => import('./pages/investment-search/investment-search.module').then(m => m.InvestmentSearchModule), canActivate: [AuthGuard] },
      { path: 'acquisitions-search', loadChildren: () => import('./pages/acquisition-search/acquisition-search.module').then(m => m.AcquisitionSearchModule), canActivate: [AuthGuard] },
      { path: 'news-search', loadChildren: () => import('./pages/news-search/news-search.module').then(m => m.NewsSearchModule), canActivate: [AuthGuard] },
      { path: 'funding-search', loadChildren: () => import('./pages/funding-search/funding-search.module').then(m => m.FundingSearchModule), canActivate: [AuthGuard] },
      { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
      { path: 'favourites', loadChildren: () => import('./pages/favourites/favourites.module').then(m => m.FavouritesModule), canActivate: [AuthGuard] },
      { path: 'change-password', loadChildren: () => import('./pages/auth-change-password/auth-change-password.module').then(m => m.AuthChangePasswordModule), canActivate: [AuthGuard] },
      { path: 'edit-profile', loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfileModule) },
      { path: 'organisations', loadChildren: () => import('./pages/company-search/company-search.module').then(m => m.CompanySearchModule), canActivate: [AuthGuard] },
      { path: 'organisations/:id', loadChildren: () => import('./pages/organisation/organisation.module').then(m => m.OrganisationModule), canActivate: [AuthGuard]},
      { path: 'people', loadChildren: () => import('./pages/people-search/people-search.module').then(m => m.PeopleSearchModule), canActivate: [AuthGuard] },
      { path: 'people/:id', loadChildren: () => import('./pages/people/people.module').then(m => m.PeopleModule), canActivate: [AuthGuard]},
      { path: 'downloads', loadChildren: () => import('./pages/downloads/downloads.module').then(m => m.DownloadsModule), canActivate: [AuthGuard] },
      { path: 'exclusions', loadChildren: () => import('./pages/exclusions/exclusions.module').then(m => m.ExclusionsModule), canActivate: [AuthGuard] },
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: './pages/authentication/authentication.module#AuthenticationModule'
      },
      // {
      //   path: 'landing',
      //   loadChildren: './pages/landing/landing.module#LandingModule'
      // }
    ]
  },
  {
    path: '**',
    loadChildren: './pages/maintenance/mainten-error/mainten-error.module#MaintenErrorModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
