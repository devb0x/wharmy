import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

const BACKEND_URL = `${environment.apiUrl}/army`

@Injectable({ providedIn: 'root'})
export class ArmyService {
	constructor(private http: HttpClient) {
	}

	getUserArmies(userId: string): Observable<any> {
		if (!userId) {
			throw new Error("user id is required")
		}

		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.get<any>(BACKEND_URL + `/armies?userId=${userId}`, { headers })
	}

	getArmy(id: string): Observable<any> {
		if (!id) {
			throw new Error("army Id is required")
		}

		return this.http.get<any>(BACKEND_URL + `/${id}`)
	}
}