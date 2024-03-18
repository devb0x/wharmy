import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs"

import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, NgForm} from "@angular/forms";
// import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	providers: [
		AuthService
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})

// export class RegisterComponent implements OnInit {
// 	form!: FormGroup
//
// 	constructor(
// 		private formBuilder: FormBuilder,
// 		public authService: AuthService,
// 	) {}
//
// 	ngOnInit() {
// 		console.log('uh')
// 		this.form = new FormGroup({
// 			email: new FormControl(null, {
// 				validators: [Validators.required]
// 			}),
// 			password: new FormControl(null, {
// 				validators: [Validators.required]
// 			})
// 		})
// 	}
//
// 	onRegisterUser() {
// 		console.log('i dont know')
// 		// this.authService.createUser(this.form.value.email, this.form.value.password)
// 	}
// }

export class RegisterComponent implements OnInit {
	form!: FormGroup
	isLoading = false
	private authStatusSub!: Subscription

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
			authStatus => {
				this.isLoading = false
			}
		)
		console.log('from ng init')
		console.log(this.isLoading)
		this.form = new FormGroup({
			email: new FormControl(null, {
				validators: [Validators.required]
			}),
			password: new FormControl(null, {
				validators: [Validators.required]
			})
		})
	}
	onRegisterUser() {
		// console.log(this.form.value.email + ' ' + this.form.value.password)

		console.log(this.form.value.password)
		this.authService.createUser(this.form.value.email, this.form.value.password)
	}
	//
	// onRegisterUser() {
	// 	console.log('ok bro')
	// 	// this.authService.createUser(this.form.value.email, this.form.value.password)
	// }
}
