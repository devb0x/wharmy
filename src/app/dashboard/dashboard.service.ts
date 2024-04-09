import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { HttpClient, HttpHeaders } from "@angular/common/http"

import { environment } from "../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}/user/`

@Injectable({ providedIn: 'root'})
export class DashboardService {

	constructor(private http: HttpClient, private router: Router) {}

	getUserInformation() {
		const userId = localStorage.getItem("userId")
		const token = localStorage.getItem("token")

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http
			.get<any>(
				BACKEND_URL + `getUserInformation?id=${userId}`,
				{ headers }
			)
	}

}