import { Injectable } from "@angular/core"

import { environment } from "../../environments/environment"
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

const BACKEND_URL = `${environment.apiUrl}/user/`

@Injectable({ providedIn: 'root'})
export class DashboardService {

	constructor(private http: HttpClient, private router: Router) {}

	getUserInformation() {
		const userId = localStorage.getItem("userId")
		console.log(userId)

		return this.http
			.get<any>(BACKEND_URL + `getUserInformation?id=${userId}`)

		// const user = this.http
		// 	.post<{id: string}>(BACKEND_URL + "getUserInformation", {_id: userId})
		// 	.subscribe(response => {
		// 		this.userInformation = response.id
		// 		console.log(response)
		// 	})
		// console.log(user)
		// console.log(this.userInformation)

		// return this.http
		// 	.post<{id: string}>(BACKEND_URL + "getUserInformation", {_id: userId})
		// 	.subscribe(response => {
		// 		this.userInformation = response.id
		// 		console.log(response)
		// 	})

	}

}