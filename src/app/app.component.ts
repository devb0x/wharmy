import { Component, OnInit } from '@angular/core'
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router'

import { HeaderComponent } from "./header/header.component"
import { HttpClientModule } from "@angular/common/http"

import { AuthService } from "./auth/auth.service";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterModule,
		RouterOutlet,
		HeaderComponent,
		HttpClientModule
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	title = 'wharmy';

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authService.autoAuthUser()
	}

}
