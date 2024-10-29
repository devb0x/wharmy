import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

import {ArmyService} from "../dashboard/army-list/army.service";
import { MiniatureService } from "./miniature.service"
import {NgIf, NgFor} from "@angular/common";
import {MiniatureInterface} from "../../models/miniature.interface";
import {ArmyInterface} from "../../models/army.interface";

@Component({
	selector: 'app-miniature',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterLink
	],
	templateUrl: './miniature.component.html',
	styleUrl: './miniature.component.css'
})
export class MiniatureComponent {
	miniature!: MiniatureInterface
	army!: ArmyInterface
	armyId!: string
	miniatureId!: string
	editLink: boolean = false

	constructor(
		private armyService: ArmyService,
		private miniatureService: MiniatureService,
		private route: ActivatedRoute,
	) {}

	ngOnInit() {
		const userId = localStorage.getItem("userId")

		this.armyId = this.route.snapshot.paramMap.get('armyId')!
		this.miniatureId = this.route.snapshot.paramMap.get('miniatureId')!

		this.route.data.subscribe(data => {
			this.miniature = data['miniatureData']
			this.army = data['armyData']
		})
		if (this.army.ownerId === userId) {
			this.editLink = true
		}
		console.log(this.miniature)
	}

}
