import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Subject } from "rxjs"

import { AuthDataModel } from "./auth-data.model"

import { environment } from "../../environments/environment"
import {Router} from "@angular/router";

const BACKEND_URL = `${environment.apiUrl}/user/`

@Injectable({ providedIn: 'root'})
export class AuthService {
	private authStatusListener = new Subject<boolean>()

	constructor(private http: HttpClient, private router: Router) {}

	createUser(email: string, password: string) {
		const authData: AuthDataModel = {email: email, password: password}
		this.http
			.post(BACKEND_URL + "signup", authData)
			.subscribe({
				next: () => this.router.navigate(['/']),
				error: () => {
					this.authStatusListener.next(false)
				}
			})
	}

	isUserExist(email: string) {
		return this.http.get<any>(BACKEND_URL + `userExist?email=${email}`);
	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable()
	}

	autoAuthUser() {
		console.log('auto auth later..')
	}
}

