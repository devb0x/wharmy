import { Routes } from '@angular/router'
import { AuthGuard } from "./auth/auth.guard"

import { LoginComponent } from "./auth/login/login.component"
import { RegisterComponent } from "./auth/register/register.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { NewCollectionComponent } from "./dashboard/new-collection/new-collection.component"

import { SandboxComponent } from "./sandbox/sandbox.component"

export const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		},
	{
		path: 'dashboard/new-collection',
		component: NewCollectionComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'sandbox',
		component: SandboxComponent
	}
]
