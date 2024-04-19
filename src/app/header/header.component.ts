import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"

import { Subscription } from "rxjs"

import { AuthService } from "../auth/auth.service"

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		RouterLink,
		RouterLinkActive
	],
	templateUrl: './header.component.html',
	styleUrl: './header.component.css'
})
export class HeaderComponent {
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
