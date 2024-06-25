import { Component } from '@angular/core'
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { NgIf, NgFor } from "@angular/common"

import { Miniature } from "../../../models/miniature.interface"

import { environment } from "../../../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}/`

@Component({
	selector: 'app-recent-uploads',
	standalone: true,
	imports: [
		NgIf,
		NgFor
	],
	templateUrl: './recent-uploads.component.html',
	styleUrl: './recent-uploads.component.css'
})
export class RecentUploadsComponent {
	miniatures$: Miniature[] = []

	constructor(private http: HttpClient) {
	}

	ngOnInit() {
		return this.http
			.get(BACKEND_URL + 'recent-uploads-miniatures')
			.subscribe(
				(data: any) => {
					this.miniatures$ = data
					console.log(this.miniatures$)
				},
				(error: HttpErrorResponse) => {
					console.error(error)
				}
			)
	}
}
