import { Routes } from '@angular/router'
import { AuthGuard } from "./auth/auth.guard"
import { ArmyEditGuard } from "./army/army-edit/army-edit.guard"

import { NotFoundComponent } from "./not-found/not-found.component"
import { LoginComponent } from "./auth/login/login.component"
import { RegisterComponent } from "./auth/register/register.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { NewCollectionComponent } from "./dashboard/new-collection/new-collection.component"
import { ArmyComponent } from "./army/army.component"
import { ArmyEditComponent } from "./army/army-edit/army-edit.component"

import { SandboxComponent } from "./sandbox/sandbox.component"
import {ArmyResolver} from "./resolvers/army.resolver";
//
// export const routes: Routes = [
// 	{
// 		path: 'login',
// 		component: LoginComponent
// 	},
// 	{
// 		path: 'register',
// 		component: RegisterComponent
// 	},
// 	{
// 		path: 'dashboard',
// 		component: DashboardComponent,
// 		canActivate: [AuthGuard],
// 		},
// 	{
// 		path: 'dashboard/new-collection',
// 		component: NewCollectionComponent,
// 		canActivate: [AuthGuard],
// 	},
// 	{
// 		path: 'sandbox',
// 		component: SandboxComponent
// 	}
// ]
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
		canActivateChild: [AuthGuard], // Use canActivateChild for child routes
		children: [
			{
				path: '', // Empty path for '/dashboard'
				component: DashboardComponent
			},
			{
				path: 'new-collection',
				component: NewCollectionComponent
			}
		]
	},
	{
		path: 'army/:id',
		component: ArmyComponent
	},
	{
		path:'army/edit/:id',
		component: ArmyEditComponent,
		canActivate: [ArmyEditGuard],
		resolve: { armyData: ArmyResolver }
	},
	{
		path: 'sandbox',
		component: SandboxComponent
	},
	{
		path: '404',
		component: NotFoundComponent
	},
	{
		path: '**',
		redirectTo: '/404'
	}
];
