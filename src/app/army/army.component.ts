import {Component, Input} from '@angular/core';
import {ParamMap, Route, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {ArmyService} from "../dashboard/army-list/army.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {Army} from "../models/army.interface";

import { DropdownComponent } from "../layout/dropdown/dropdown.component"

@Component({
	selector: 'app-army',
	standalone: true,
	imports: [
		NgIf,
		DropdownComponent
	],
	templateUrl: './army.component.html',
	styleUrl: './army.component.css'
})
export class ArmyComponent {
	constructor(
		private router: Router,
		private armyService: ArmyService
	) {}

	@Input() id = ''

	army$: Army | null = null

	ngOnInit() {
		if (this.id) {
			this.armyService
				.getArmy(this.id)
				.subscribe(
					(army: any) => {
						this.army$ = army
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
