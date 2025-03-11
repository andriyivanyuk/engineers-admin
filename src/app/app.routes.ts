import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { CreateProductComponent } from './pages/products/create-product/create-product.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  // {
  //   path: 'auth',
  //   component: AuthLayoutComponent,
  //   children: [
  //     { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  //     {
  //       path: 'register',
  //       component: RegisterComponent,
  //       canActivate: [AuthGuard],
  //     },
  //     { path: 'verify/:token', component: VerifyComponent },
  //   ],
  // },
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-product', component: CreateProductComponent },
      // { path: 'create-product', component: CreateProductComponent },
      // { path: 'create-category', component: AddCategoryComponent },
    ],
  },
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
];
