import { Component, Input } from '@angular/core'

@Component({
	selector: 'app-dropdown',
	standalone: true,
	imports: [],
	templateUrl: './dropdown.component.html',
	styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
	@Input() iconUrl: string = '../../../assets/icons/game-icons_spiral-arrow.svg'

	clickHandler(event: any) {
		const parentDiv = event.currentTarget.parentNode as HTMLElement
		parentDiv.classList.toggle('collapsed')
	}

}
