import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';
import { InvoicesResolve } from './invoices.resolve';
import { SellersResolve } from './sellers.resolve';
import { SellerResolve } from './seller.resolve';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './error404/error404.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserShowComponent } from './user-show/user-show.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { UploadComponent } from './upload/upload.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceAllComponent } from './invoice-all/invoice-all.component';

import { SellerNewComponent } from './seller-new/seller-new.component'; 
import { SellerIndexComponent } from './seller-index/seller-index.component';
import { SellerShowComponent } from './seller-show/seller-show.component';
import { SellerEditComponent } from './seller-edit/seller-edit.component';

const routes: Routes = [
  { path: '',  component: WelcomeComponent },
  { path: 'upload',  canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: UploadComponent 
      }
    ]
  },
  { path: 'invoice', canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: InvoiceComponent,
        resolve: { 
          invoices: InvoicesResolve,
        } 
      },
      { 
        path: 'all', 
        component: InvoiceAllComponent,
        resolve: { 
          invoices: InvoicesResolve,
        } 
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'users/new',  component: UserNewComponent },
  { path: 'users', canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        component: UserIndexComponent,
        resolve: { 
          users: UsersResolve,
        } 
      },
      { 
        path: ':userID',
        component: UserShowComponent,
        resolve: {
          user: UserResolve
        }
      },
      { 
        path: ':userID/edit',
        component: UserEditComponent,
        resolve: {
          user: UserResolve
        }
      },
    ]
  },
  { path: 'sellers', canActivate: [AuthGuard],
    children: [
      {
        path: 'new', component: SellerNewComponent,  
      },
      { 
        path: '', component: SellerIndexComponent,      
        resolve: {
          sellers: SellersResolve,
        } 
      },
      { 
        path: ':userID',
        component: SellerShowComponent,
        resolve: {
          seller: SellerResolve
        }
      },
      { 
        path: ':userID/edit',
        component: SellerEditComponent,
        resolve: {
          seller: SellerResolve
        }
      },
    ]
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [ 
    RouterModule 
  ],
  declarations: []
})
export class AppRoutingModule { }
