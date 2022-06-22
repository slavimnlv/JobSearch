import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AcEmployerGuard } from "../guards/acEmployer.guard";
import { AcCandidateGuard } from "../guards/acCandidate.guard";
import { JobAdReactiveFormComponent } from "./job-ads/job-ad-reactive-form/job-ad-reactive-form.component";
import { JobAdShowComponent } from "./job-ads/job-ad-show/job-ad-show.component";
import { MainComponent } from "./main.component";
import { CandidatesComponent } from "./applications/candidates/candidates.component";
import { UserReactiveFormComponent } from "./users/user-reactive-form/user-reactive-form.component";
import {
  ApplicationReactiveFormComponent
} from "./applications/application-reactive-form/application-reactive-form.component";

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'job-ads',
                component: JobAdShowComponent
            },
            {
                path: 'account',
                component: UserReactiveFormComponent
            },
            {
                path: 'my-job-ads',
                component: JobAdShowComponent
            },
            {
                path: 'my-job-ads/candidates/:id',
                component: CandidatesComponent,
                canActivate: [AcEmployerGuard]

            },
            {
                path: 'job-ads/edit/:id',
                component: JobAdReactiveFormComponent,
                canActivate: [AcEmployerGuard]
            },
            {
                path: 'job-ads/apply/:id',
                component: ApplicationReactiveFormComponent,
                canActivate: [AcCandidateGuard]
            },
            {
                path: 'job-ads/create',
                component: JobAdReactiveFormComponent,
                canActivate: [AcEmployerGuard]
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'job-ads'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class MainRoutingModule{}
