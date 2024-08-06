import { Component } from '@angular/core'
import {NgFor, NgIf} from "@angular/common"
import { HttpClient, HttpErrorResponse } from "@angular/common/http"

import { environment } from "../../../../environments/environment"

import { PictureInterface } from "../../../models/picture.interface"

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
	miniatures$: PictureInterface[] = []

	constructor(private http: HttpClient) {}

	ngOnInit() {
		return this.http
			.get(BACKEND_URL + 'recent-uploads')
			.subscribe(
				(data: any) => {
					this.miniatures$ = data
					console.log('miniatures from recent uploads: ', this.miniatures$)
				},
				(error: HttpErrorResponse) => {
					console.error(error)
				}
			)
	}
}
