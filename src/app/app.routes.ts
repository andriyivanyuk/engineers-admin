import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { CreateProductComponent } from './pages/products/create-product/create-product.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { VerifyComponent } from './pages/authentication/verify/verify.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';
import { NotFoundComponent } from './pages/authentication/not-found/not-found.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
      { path: 'verify/:token', component: VerifyComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-product', component: CreateProductComponent },
      { path: 'product-list', component: ProductListComponent },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
