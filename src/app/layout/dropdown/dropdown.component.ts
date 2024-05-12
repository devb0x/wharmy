import { Component } from '@angular/core';

@Component({
	selector: 'app-dropdown',
	standalone: true,
	imports: [],
	templateUrl: './dropdown.component.html',
	styleUrl: './dropdown.component.css'
})
export class DropdownComponent {

	clickHandler(event: any) {
		const parentDiv = event.currentTarget.parentNode as HTMLElement
		parentDiv.classList.toggle('collapsed')
	}

}
