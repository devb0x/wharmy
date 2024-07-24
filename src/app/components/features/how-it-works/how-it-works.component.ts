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
			title: 'Organize your collection',
			description: 'Keep track of all your Warhammer miniatures in one place.',
			icon: `../../../assets/icons/game-icons_jigsaw-box.svg`
		},
		{
			title: 'Showcase Your Armies',
			description: 'Share your beautifully painted armies with the community.',
			icon: `../../../assets/icons/game-icons_lovers.svg`
		},
		{
			title: 'Secure Storage',
			description: 'Safely store images and details of your collection.',
			icon: `../../../assets/icons/game-icons_shield-echoes.svg`
		}
	]
}
