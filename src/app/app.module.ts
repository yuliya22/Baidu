import { UserService } from './shared/userService/user.service';
import { DemoMaterialModule } from './demo-material-module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
//module
import { ComponentModule } from './component/component.module';
//route
import { AppRoutes } from './app.routing';
//components
import { AppComponent } from './app.component';
//user
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    DemoMaterialModule,
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
	  multi: true
    },
    AuthGuard,UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
