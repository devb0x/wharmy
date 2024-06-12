import { Component } from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { CommonModule } from '@angular/common'
import {environment} from "../../../../environments/environment"

const BACKEND_URL = `${environment.apiUrl}/`

@Component({
	selector: 'app-image-upload',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
	selectedFile: File | null = null;

	constructor(private http: HttpClient) {}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0]
		}
	}

	uploadFile(): void {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		if (this.selectedFile) {
			const formData = new FormData();
			formData.append('file', this.selectedFile, this.selectedFile.name)
			// formData.append('ownerId', ownerId)

			this.http.post(BACKEND_URL + `upload`, formData, { headers })
				.subscribe(
					response => console.log('File uploaded successfully', response),
					error => console.error('File upload failed', error)
				)
		}
	}
}
