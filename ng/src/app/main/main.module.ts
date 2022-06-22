import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { JobAdItemComponent } from './job-ads/job-ad-item/job-ad-item.component';
import { JobAdReactiveFormComponent } from './job-ads/job-ad-reactive-form/job-ad-reactive-form.component';
import { JobAdShowComponent } from './job-ads/job-ad-show/job-ad-show.component';
import { UserReactiveFormComponent } from "./users/user-reactive-form/user-reactive-form.component";
import { CandidateItemComponent } from "./applications/candidate-item/candidate-item.component";
import { CandidatesComponent } from "./applications/candidates/candidates.component";
import { ApplicationReactiveFormComponent } from './applications/application-reactive-form/application-reactive-form.component';
//import { UsersRegisterReactiveFormComponent } from './users/users-register-reactive-form/users-register-reactive-form.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MainRoutingModule
    ],
    declarations: [
    MainComponent,
    JobAdItemComponent,
    JobAdReactiveFormComponent,
    JobAdShowComponent,
    UserReactiveFormComponent,
    CandidateItemComponent,
    CandidatesComponent,
    ApplicationReactiveFormComponent,
    //UsersRegisterReactiveFormComponent
    ]
})
export class MainModule{

}
