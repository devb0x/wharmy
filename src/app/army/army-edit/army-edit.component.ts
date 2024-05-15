import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import {Army} from "../../models/army.interface";

@Component({
	selector: 'app-army-edit',
	standalone: true,
	imports: [],
	templateUrl: './army-edit.component.html',
	styleUrl: './army-edit.component.css'
})
export class ArmyEditComponent {
	armyId!: string;
	army: Army | null = null;

	constructor(private route: ActivatedRoute) { }


	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.army = data['armyData']; // Access resolved army data
		});
		console.log(this.army)
	}

}
