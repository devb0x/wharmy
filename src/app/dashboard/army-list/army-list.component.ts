import { Component } from '@angular/core'

import { ArmyService } from "./army.service"

import { ArmyCardComponent } from "./army-card/army-card.component"
import {HttpErrorResponse} from "@angular/common/http";
import {NgFor} from "@angular/common";

import { Army } from '../../models/army.interface'

@Component({
	selector: 'app-army-list',
	standalone: true,
	imports: [
		NgFor,
		ArmyCardComponent,
	],
	templateUrl: './army-list.component.html',
	styleUrl: './army-list.component.css'
})
export class ArmyListComponent {
	constructor(private armyService: ArmyService) {}
	armies: Army[] = []

	ngOnInit() {
		const userId: string | null = localStorage.getItem('userId')
		if (!userId) {
			return
		}
		this.armyService
			.getUserArmies(userId)
			.subscribe(
				(armies: any) => {
					this.armies = armies
					console.log(this.armies)
				},
				(error: HttpErrorResponse) => {
					console.error(error)
				}
		)
	}
}
