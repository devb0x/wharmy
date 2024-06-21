import { Component, OnInit } from '@angular/core'
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router'

import { HttpClientModule } from "@angular/common/http"

import { AuthService } from "./auth/auth.service";

import {NavbarComponent} from "./layout/navbar/navbar.component";
import {ImageUploadComponent} from "./army/army-edit/image-upload/image-upload.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterModule,
		RouterOutlet,
		NavbarComponent,
		HttpClientModule,
		ImageUploadComponent
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
