import { Component } from '@angular/core'
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router"
import { CommonModule } from "@angular/common"

import {filter, Subscription} from "rxjs"

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
	userIsAuth:boolean = false
	private authListenerSubs!: Subscription
	private routerEventsSub!: Subscription
	mobileMenuOpen: boolean = false

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.userIsAuth = this.authService.getIsAuth()
		this.authListenerSubs = this.authService
			.getAuthStatusListener()
			.subscribe(isUserAuth => {
				this.userIsAuth = isUserAuth
			})
		// Listen to router events
		// this.router.events.subscribe(event => {
		// 	if (event instanceof NavigationEnd) {
		// 		// Handle navigation end event, update component state as needed
		// 		console.log('call from ngOnInit lifecycle')
		// 		this.userIsAuth = this.authService.getIsAuth();
		// 		// console.log(this.mobileMenuOpen)
		// 		this.mobileMenuOpen = false
		// 		const mobileNav = document.querySelector('.mobile-navbar') as HTMLElement
		// 		if (mobileNav) {
		// 			console.warn('called #2')
		// 			console.log(mobileNav)
		// 			mobileNav.classList.toggle('display')
		// 			mobileNav.classList.add('hidden')
		// 			mobileNav.style.display = 'none'
		//
		// 			// this.mobileMenuOpen = false
		// 		}
		// 		// console.log(this.mobileMenuOpen)
		// 	}
		// });

	}

	// ngAfterViewInit() {
	// 	const mobileNav = document.querySelector('.mobile-navbar') as HTMLElement
	// 	if (mobileNav) {
	// 		console.warn('called #2')
	// 		console.log(mobileNav)
	// 		mobileNav.classList.remove('display')
	// 		mobileNav.style.display = 'flex'
	// 	}
	// }

	ngOnDestroy() {
		this.authListenerSubs.unsubscribe()
		this.routerEventsSub.unsubscribe()
	}

	toggleMobileNav() {
		console.log('toggleMobileNav() clicked ')
		this.mobileMenuOpen = !this.mobileMenuOpen;
		if (!this.mobileMenuOpen) {
			this.hiddeMobileNav()
		}
		setTimeout(() => {
			const ul = document.querySelector('.mobile-navbar-list') as HTMLElement
			ul.classList.toggle('translate')
		}, 50)
	}

	hiddeMobileNav() {
		console.log('hiddeMobileNav() called')
		this.mobileMenuOpen = false
		const mobileNav = document.querySelector('.mobile-navbar') as HTMLElement
		if (mobileNav) {
			mobileNav.classList.remove('display')
			mobileNav.classList.add('hidden')
			// mobileNav.style.display = 'none'
		}
	}

	closeMobileNav() {
		console.log('closeCustom called')
		this.toggleMobileNav()
	}

}
