import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router"
import {Army} from "../../models/army.interface";
import {Location, NgIf} from "@angular/common";
import {DropdownComponent} from "../../layout/dropdown/dropdown.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ImageUploadComponent} from "./image-upload/image-upload.component";

const BACKEND_URL = `${environment.apiUrl}/army/`

@Component({
	selector: 'app-army-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DropdownComponent,
		NgIf,
		ImageUploadComponent
	],
	templateUrl: './army-edit.component.html',
	styleUrl: '../army.component.css'
})
export class ArmyEditComponent {
	armyId!: string;
	army$: Army | null = null;
	armyForm!: FormGroup

	selectedFile: File | null = null;


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private http: HttpClient,
		private formBuilder: FormBuilder
	) {
		this.armyForm = this.formBuilder.group({
			description: [this.army$?.description || ''],
			lore: [this.army$?.lore || '']
		});
	}



	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.army$ = data['armyData']; // Access resolved army data
		});
		console.log(this.army$)

	}

	cancelEditHandler(): void {
		if (confirm('Are you sure you want to cancel the edit? Unsaved changes will be lost.')) {
			this.location.back();
		}
	}

	formSubmit() {
		const id = this.army$?._id
		const updatedData: any = {}

		if (!this.army$ || !this.army$._id) {
			console.error('Invalid army data');
			return;
		}
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		if (this.armyForm.value.description) {
			updatedData.description = this.armyForm.value.description
		}
		if (this.armyForm.value.lore) {
			updatedData.lore = this.armyForm.value.lore
		}

		this.http
			.put(
				BACKEND_URL + `edit/${id}`,
				updatedData,
				{ headers }
			)
			.subscribe(
				(response) => {
					console.log(response)
					this.router.navigate([`army/${id}`])
				},
				(error) => {
					console.log(error)
				}
			)
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
		}
	}

	uploadFile(event: Event): void {
		event.preventDefault();

		if (!this.selectedFile) {
			console.error('No file selected');
			return;
		}

		const formData = new FormData();
		formData.append('image', this.selectedFile, this.selectedFile.name);
		formData.append('armyId', this.armyId)

		const token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		this.http.post('http://localhost:3000/api/army/upload-image', formData, { headers })
			.subscribe(
				response => {
					console.log('log of response after submit file image upload')
					console.log(response)
					console.log('File uploaded successfully', response);
				},
				error => {
					console.error('Error uploading file', error);
				}
			);
	}

		// const testingStuff = {
		// 	Body: "hello world",
		// 	Bucket: "wharmy",
		// 	Key: "my-file.txt"
		// }
		// this.http.post('http://localhost:3000/api/army/upload-image', testingStuff)
		// 	.subscribe(
		// 		response => {
		// 			console.log(response)
		// 			console.log('File uploaded successfully', response);
		// 		},
		// 		error => {
		// 			console.error('Error uploading file', error);
		// 		}
		// 	);


}
