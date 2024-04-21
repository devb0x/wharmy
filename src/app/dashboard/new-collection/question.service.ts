import { Injectable } from "@angular/core"

import { QuestionBase } from "./question-base"
import { DropdownQuestion } from "./question-dropdown"
import { of } from "rxjs"
import {TextboxQuestion} from "./question-textbox";

@Injectable()
export class QuestionService {
	step = 1
	public maxStep = 0

	getQuestions() {

		const questions: QuestionBase<string>[] = [

			new DropdownQuestion({
				key: 'category',
				label: 'Category',
				options: [
					{key: 'age of sigmar', value: 'Age of Sigmar'},
					{key: 'warhammer 40K', value: 'Warhammer 40K'},
					{key: 'middle-earth', value: 'Middle-Earth'}
				],
				required: true,
				order: 1,
				step: 1
			}),

			new DropdownQuestion({
				key: 'faction',
				label: 'Faction Label',
				options: [
					{key: 'space marine', value: 'Space Marine'},
					{key: 'xenos armies', value: 'Xenos Armies'}
				],
				required: true,
				order: 2,
				step: 2
			}),

			new TextboxQuestion({
				key: 'name',
				label: 'Collection name',
				required: true,
				order: 3,
				step: 3
			})
		]

		this.maxStep = questions.length

		return of(questions.sort((a, b) => a.order - b.order))
	}

	getMaxStep() {
		return this.maxStep
	}

	getStep() {
		return this.step
	}
}