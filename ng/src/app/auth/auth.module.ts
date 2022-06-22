import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./login/login.component";
import { UsersRegisterReactiveFormComponent } from "./users-register-reactive-form/users-register-reactive-form.component";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        AuthRoutingModule
    ],
    declarations: [
        LoginComponent,
        AuthComponent,
        UsersRegisterReactiveFormComponent
    ]
})
export class AuthModule{

}
