import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"

import { Subscription } from "rxjs"

import { AuthService } from "../../auth/auth.service"

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {
	userIsAuth = false
	private authListenerSubs!: Subscription

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.userIsAuth = this.authService.getIsAuth()
		this.authListenerSubs = this.authService
			.getAuthStatusListener()
			.subscribe(isUserAuth => {
				this.userIsAuth = isUserAuth
			})
	}

	ngOnDestroy() {
		this.authListenerSubs.unsubscribe()
	}

}
