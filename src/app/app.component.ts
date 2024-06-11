import { Component, OnInit } from '@angular/core'
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router'

import { HeaderComponent } from "./header/header.component"
import { HttpClientModule } from "@angular/common/http"

import { AuthService } from "./auth/auth.service";
import {ImageUploadComponent} from "./army/army-edit/image-upload/image-upload.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterModule,
		RouterOutlet,
		HeaderComponent,
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
