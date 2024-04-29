import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import { QuestionBase } from "./question-base"
import { DropdownQuestion } from "./question-dropdown"
import { TextboxQuestion } from "./question-textbox"

import {map, Observable, of} from "rxjs"

interface FactionOption {
	key: string;
	value: string;
}

@Injectable()
export class QuestionService {
	step = 1
	public maxStep = 0

	constructor(private http: HttpClient) {}

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
				key: 'subCategory',
				label: 'Faction',
				options: [],
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

	getFactionOptions(category: string): Observable<FactionOption[]> {
		return this.http.get<{ [key: string]: FactionOption[] }>('../../assets/faction-options.json')
			.pipe(
				map(options => {
					const lowercaseCategory = category.toLowerCase();
					return options[lowercaseCategory] || [];
				})
			)
	}

	getMaxStep() {
		return this.maxStep
	}

	getStep() {
		return this.step
	}
}