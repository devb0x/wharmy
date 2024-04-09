import { Component } from '@angular/core'

import { DashboardService } from "./dashboard.service"
import {AuthService} from "../auth/auth.service";
import { Subject, Subscription, takeUntil } from "rxjs";
import {Router} from "@angular/router";

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
	private sub!: Subscription;
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
		private dashboardService: DashboardService,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		if (!this.authService.getIsAuth()) {
			this.router.navigate(['/login']);
			return;
		}
		this.sub = this.dashboardService
			.getUserInformation()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: response => {
					if (!response.exists) {
						console.log("User information not found.");
						return;
					}
					this.userData = response.user;
				},
				error: err => {
					console.error("Error fetching user information:", err);
				}
			});
	}


	logout() {
		this.authService.logout()
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

}
