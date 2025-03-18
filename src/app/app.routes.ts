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
import { CreateCodeComponent } from './pages/super-admin/create-code/create-code.component';
import { CodeListComponent } from './pages/super-admin/code-list/code-list.component';
import { RoleGuard } from './guards/role.guard';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';
import { CreateCategoryComponent } from './pages/products/create-category/create-category.component';
import { CategoryListComponent } from './pages/products/category-list/category-list.component';
import { EditCategoryComponent } from './pages/products/edit-category/edit-category.component';

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
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-product', component: CreateProductComponent },
      { path: 'create-category', component: CreateCategoryComponent },
      { path: 'category-list', component: CategoryListComponent },

      {
        path: 'edit-product/:id',
        component: EditProductComponent,
      },
      {
        path: 'edit-category/:id',
        component: EditCategoryComponent,
      },

      { path: 'product-list', component: ProductListComponent },
      { path: 'create-code', component: CreateCodeComponent },
      { path: 'code-list', component: CodeListComponent },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
