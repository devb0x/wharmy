import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router"
import {Army} from "../../models/army.interface";
import {Location, NgIf, NgFor } from "@angular/common";
import {DropdownComponent} from "../../layout/dropdown/dropdown.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ImageUploadComponent} from "./image-upload/image-upload.component";
import {ConfirmationModalComponent} from "../../layout/confirmation-modal/confirmation-modal.component";
// import { ChangeDetectorRef } from '@angular/core';


const BACKEND_URL = `${environment.apiUrl}/army/`

@Component({
	selector: 'app-army-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DropdownComponent,
		NgIf,
		NgFor,
		ImageUploadComponent,
		ConfirmationModalComponent
	],
	templateUrl: './army-edit.component.html',
	styleUrl: '../army.component.css'
})
export class ArmyEditComponent {
	armyId!: string
	army$: Army | null = null
	armyForm!: FormGroup

	selectedFile: File | null = null
	miniatureIdToDelete: string | null = null;

	constructor(
		// private cdr: ChangeDetectorRef,
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
			if (this.army$ && this.army$._id) {
				this.armyId = this.army$._id;
			}
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

	fetchArmyData(): void {
		const id = this.army$?._id;

		if (!id) {
			return;
		}

		const token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		this.http.get<Army>(`${BACKEND_URL}${id}`, { headers }).subscribe(
			response => {
				this.army$ = response;
			},
			error => {
				console.error('Error fetching army data', error);
			}
		);
	}

	onDeleteSubmit(miniatureId: string): void {
		const token = localStorage.getItem("token")
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

		this.http
			.delete(
				`${environment.apiUrl}/delete/${miniatureId}`,
				{ headers }
			)
			.subscribe(
				response => {
					console.log('Deletion success', response)
					if (this.army$) {
						this.army$.miniatures = this.army$.miniatures
							.filter(miniature => miniature._id !== miniatureId)
					}
				},
				error => {
					console.log(error)
					this.miniatureIdToDelete = null
				}
			)
		this.miniatureIdToDelete = null
	}

	showDeleteModal(miniatureId: string): void {
		this.miniatureIdToDelete = miniatureId;
	}
	onDeleteCancel(): void {
		this.miniatureIdToDelete = null;
	}
	onDeleteConfirm(miniatureId: string): void {
		this.onDeleteSubmit(miniatureId)
	}

	// unused function (was display 'undefined' instead of the image picture
	handleFileUpload(newMiniatures: any[]): void {
		if (this.army$) {
			// this.army$.miniatures.push(...newMiniatures)
			this.army$.miniatures = [...this.army$.miniatures, ...newMiniatures]
			// this.cdr.detectChanges()
		}
	}
}
