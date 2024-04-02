import { Component, OnInit } from '@angular/core'
import { NgIf } from "@angular/common"
import {Subject, Subscription} from "rxjs"

import {
	FormGroup,
	FormControl,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import {AuthService} from "../auth.service";
import {response} from "express";

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		NgIf,
		ReactiveFormsModule
	],
	providers: [
		AuthService
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
	form!: FormGroup
	isLoading = false
	pwdIdentical = true
	userExist = false
	private authStatusSub!: Subscription

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
		this.form = new FormGroup({
			email: new FormControl(null, {
					updateOn: 'change',
					validators: [
						Validators.required,
						Validators.email,
						Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
					]
				}),
			pwd: new FormControl(null, {
				updateOn: 'change',
				validators: [Validators.required]
			}),
			pwdConfirm: new FormControl(null, {
				updateOn: 'change',
				validators: [Validators.required]
			})
		})
		this.isLoading = false
	}

	get email() {
		return this.form.get('email');
	}

	get pwd() {
		return this.form.get('pwd')
	}

	get pwdConfirm() {
		return this.form.get('pwdConfirm')
	}

	onRegisterUser() {
		this.isLoading = true

		if (this.form.invalid) {
			alert("The form is invalid")
			return
		}

		if (this.form.value.pwd !== this.form.value.pwdConfirm) {
			alert("The passwords should be identical")
			this.pwdIdentical = false
			return
		}

		this.isLoading = false

		this.authService
			.isUserExist(this.form.value.email)
			.subscribe(response =>
				this.userExist = response.exists
			)
		this.authService.createUser(this.form.value.email, this.form.value.pwd)
	}

	onBlurEvent() {
		this.pwdIdentical = this.form.value.pwd === this.form.value.pwdConfirm;
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe()
	}

}
