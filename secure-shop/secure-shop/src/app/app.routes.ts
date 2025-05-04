import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { EndexComponent } from './pages/endex/endex.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ContactComponent } from './pages/contact/contact.component';
import { WhyComponent } from './pages/why/why.component';
import { TestimonialComponent } from './pages/testimonial/testimonial.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RoleGuard } from './core/auth/role.guard';
import { publicGuard } from './core/auth/public.guard';
import {CartComponent} from "@pages/cart/cart.component";
import {CheckoutComponent} from "@pages/checkout/checkout.component";
import {OrderSuccessComponent} from "@pages/order-success/order-success.component";
import {ForbiddenComponent} from "@pages/forbidden/forbidden.component";
import {HomeGuard} from "@core/auth/home.guard";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: EndexComponent, canActivate: [HomeGuard]},
      { path: 'shop', component: ShopComponent, canActivate: [HomeGuard] },
      { path: 'contact', component: ContactComponent , canActivate: [HomeGuard]},
      { path: 'why', component: WhyComponent , canActivate: [HomeGuard]},
      { path: 'testimonial', component: TestimonialComponent, canActivate: [HomeGuard] },
      {
        path:'cart',
        component: CartComponent,
        canActivate:[RoleGuard],data:{role:'USER'}
      },
      {
        path:'checkout',
        component: CheckoutComponent,
        canActivate:[RoleGuard],data:{role:'USER'}
      },
      { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [publicGuard] },
      {path: 'forbidden', component:ForbiddenComponent},
      // {
      //   path: 'admin',
      //   loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
      //   canActivate:[RoleGuard],data:{role:'ADMIN'}
      // },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate:[RoleGuard],data:{role:'ADMIN'}
      },

      { path: 'order-success', component: OrderSuccessComponent, canActivate:[RoleGuard],data:{role:'USER'}},
      { path: '', loadComponent: () => import('./pages/endex/endex.component').then(m => m.EndexComponent) },
      { path: '**', redirectTo: '' },
    ],
  },

];


