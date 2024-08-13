import {Component, Input, Output} from '@angular/core';
import {ActivatedRoute, ParamMap, Route, Router, RouterLink} from "@angular/router";
import {switchMap} from "rxjs";
import {ArmyService} from "../dashboard/army-list/army.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgFor, NgIf} from "@angular/common";
import {Army} from "../models/army.interface";

import { DropdownComponent } from "../layout/dropdown/dropdown.component"
import {ImageUploadComponent} from "./army-edit/image-upload/image-upload.component";

@Component({
	selector: 'app-army',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		DropdownComponent,
		RouterLink,
		ImageUploadComponent
	],
	templateUrl: './army.component.html',
	styleUrl: './army.component.css'
})
export class ArmyComponent {
	constructor(
		private router: Router,
		private armyService: ArmyService,
		private route: ActivatedRoute
	) {}

	@Input() armyId = ''

	army$: Army | null = null
	editLink: boolean = false

	ngOnInit() {
		const userId = localStorage.getItem("userId")

		if (this.armyId) {
			this.armyService
				.getArmy(this.armyId)
				.subscribe(
					(army: any) => {
						this.army$ = army
						console.log(this.army$)
						if (army.ownerId === userId) {
							this.editLink = true
						}
					},
					(error: HttpErrorResponse) => {
						console.error(error)
					}
				)
		} else {
			console.error("Army ID is missing or invalid")
		}

	}

}
