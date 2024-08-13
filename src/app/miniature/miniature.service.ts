import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const BACKEND_URL = `${environment.apiUrl}/army/`

@Injectable({ providedIn: 'root'})
export class MiniatureService {
	constructor(
		private http: HttpClient
	) {}

	getMiniature(armyId: string, miniatureId: string): Observable<any> {
		if (!armyId || !miniatureId) {
			throw new Error('Invalid Ids provided')
		}
		console.log('get miniature from service called')
		return this.http
			.get(
				BACKEND_URL + `${armyId}/miniature/${miniatureId}`
			)
	}
}