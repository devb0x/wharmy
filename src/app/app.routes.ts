import { Routes } from '@angular/router'

import { LoginComponent } from "./auth/login/login.component"
import { RegisterComponent } from "./auth/register/register.component"

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
		path: 'sandbox',
		component: SandboxComponent
	}
]
