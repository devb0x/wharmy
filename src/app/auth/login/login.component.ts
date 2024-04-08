import { Component } from '@angular/core'
import {FormsModule, NgForm} from "@angular/forms"
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		FormsModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	isLoading = false
	private authStatusSub!: Subscription

	constructor(public authService: AuthService) {}

	ngOnInit() {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
	}

	onLogin(form: NgForm) {
		if (form.invalid) {
			return
		}
		this.isLoading = true
		this.authService.login(form.value.email, form.value.password)
	}
}
