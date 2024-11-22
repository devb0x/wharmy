import { Component } from '@angular/core'
import { NgIf } from "@angular/common"

import { AuthService } from "../auth/auth.service"
import {Subscription} from "rxjs";

@Component({
	selector: 'app-sandbox',
	standalone: true,
	imports: [
		NgIf
	],
	templateUrl: './sandbox.component.html',
	styleUrl: './sandbox.component.css'
})
export class SandboxComponent {
	isLoading = false
	private authStatusSub!: Subscription


	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.isLoading = true

		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
		this.isLoading = false
	}
}
