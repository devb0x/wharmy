import {Component, Input} from '@angular/core'

import { Army } from "../../../models/army.interface"
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-army-card',
	standalone: true,
	imports: [
		RouterLink
	],
	templateUrl: './army-card.component.html',
	styleUrl: './army-card.component.css',
})
export class ArmyCardComponent {
	@Input() army: Army | undefined
}
