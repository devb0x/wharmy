import { Component } from '@angular/core'
import { HttpClient } from "@angular/common/http"

import { DashboardService } from "./dashboard.service"
import {AuthService} from "../auth/auth.service";
import {takeUntil} from "rxjs";
import {response} from "express";

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
	// TODO create userdata model
	userData: any

	constructor(
		private dashboardService: DashboardService,
		private authService: AuthService,
		private http: HttpClient
	) {}

	ngOnInit() {
		this.userData = this.dashboardService
			.getUserInformation()
			.subscribe(response => {
				if (!response.exists) {
					return
				}
				this.userData = response.user
			})

	}

	logout() {
		this.authService.logout()
	}

	// ngOnDestroy() {
	// 	this.userData = null
	// }

}
