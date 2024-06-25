import { Component } from '@angular/core';
import {NgFor} from "@angular/common";

@Component({
	selector: 'app-how-it-works',
	standalone: true,
	imports: [
		NgFor
	],
	templateUrl: './how-it-works.component.html',
	styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
	steps = [
		{
			title: 'Save',
			description: 'Keep track of all your Warhammer miniatures in one place.',
			icon: 'save-icon'
		},
		{
			title: 'Manage',
			description: 'Share your beautifully painted armies with the community.',
			icon: 'manage-icon'
		},
		{
			title: 'Share',
			description: 'Safely store images and details of your collection.',
			icon: 'share-icon'
		}
	]
}
