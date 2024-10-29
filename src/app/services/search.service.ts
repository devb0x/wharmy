import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}`

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	constructor(
		private http: HttpClient
	) {}

	searchArmies(name: string): Observable<any> {
		const params = new HttpParams().set('query', name)
		return this.http.get<any>(
			BACKEND_URL + '/army/search-armies',
			{ params }
		)
	}

	searchUsers(name: string): Observable<any> {
		const params = new HttpParams().set('query', name)
		return this.http.get<any>(
			BACKEND_URL + '/user/search-users',
			{ params }
		)
	}
}