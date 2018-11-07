import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FileSelectDirective } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';
import { InvoicesResolve } from './invoices.resolve';
import { SellersResolve } from './sellers.resolve';
import { SellerResolve } from './seller.resolve';

import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { RequestInterceptorService } from './request-interceptor.service';
import { UserService } from './user.service';
import { SellerService } from './seller.service';

import { ExcelService } from './excel.service';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserShowComponent } from './user-show/user-show.component';
import { UploadComponent } from './upload/upload.component';
import { InvoiceComponent } from './invoice/invoice.component';

import { SellerNewComponent } from './seller-new/seller-new.component';
import { SellerIndexComponent } from './seller-index/seller-index.component';
import { SellerEditComponent } from './seller-edit/seller-edit.component';
import { SellerShowComponent } from './seller-show/seller-show.component';
import { InvoiceAllComponent } from './invoice-all/invoice-all.component';
import { InvoiceSaleComponent } from './invoice-sale/invoice-sale.component';
import { InvoiceDeadlineComponent } from './invoice-deadline/invoice-deadline.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    Error404Component,
    LoginComponent,
    UserNewComponent,
    UserIndexComponent,
    UserEditComponent,
    UserShowComponent,
    UploadComponent,
    FileSelectDirective,
    InvoiceComponent,
    SellerNewComponent,
    SellerIndexComponent,
    SellerEditComponent,
    SellerShowComponent,
    InvoiceAllComponent,
    InvoiceSaleComponent,
    InvoiceDeadlineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true,
    },
    AuthGuard,
    UtilService,
    AuthService,
    UserService,
    UsersResolve,
    UserResolve,
    InvoicesResolve,
    SellerService,
    SellersResolve,
    SellerResolve,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
