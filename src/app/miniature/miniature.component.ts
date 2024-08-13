import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {ArmyService} from "../dashboard/army-list/army.service";
import { MiniatureService } from "./miniature.service"
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-miniature',
	standalone: true,
	imports: [
		NgIf
	],
	templateUrl: './miniature.component.html',
	styleUrl: './miniature.component.css'
})
export class MiniatureComponent {
	miniature!: any

	constructor(
		private armyService: ArmyService,
		private miniatureService: MiniatureService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		const armyId = this.route.snapshot.paramMap.get('armyId')
		const miniatureId = this.route.snapshot.paramMap.get('miniatureId')

		if (armyId && miniatureId) {
			this.armyService
				.getMiniature(armyId, miniatureId)
				.subscribe(
					(miniatureData: any) => {
						this.miniature = miniatureData
					},
					(error) => {
						this.router.navigate(['not-found']).then(() => {
							console.log('Error fetching miniature data', error)
						})
					}
				)
		} else {
			console.error('Army Id or Miniature Id is missing')
		}
	}

}
