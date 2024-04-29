import {Component, Input, OnInit} from "@angular/core";
import { Router } from "@angular/router"
import {CommonModule} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms"

import {QuestionControlService} from "./question-control.service";
import {QuestionBase} from "./question-base";
import {DynamicFormQuestionComponent} from "./dynamic-form-question.component";
import {QuestionService} from "./question.service";
import {DropdownQuestion} from "./question-dropdown";
import {DashboardService} from "../dashboard.service";

@Component({
	standalone: true,
	selector: 'app-dynamic-form',
	templateUrl: './dynamic-form.component.html',
	providers: [
		QuestionControlService
	],
	imports: [
		CommonModule,
		DynamicFormQuestionComponent,
		ReactiveFormsModule
	],
	styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit {
	@Input() questions: QuestionBase<string>[] | null = []
	form!: FormGroup
	payLoad = ''
	step = this.questionService.getStep()

	constructor(
		private qcs: QuestionControlService,
		private questionService: QuestionService,
		private router: Router,
		private dashboardService: DashboardService
	) {}

	ngOnInit() {
		this.questionService.getQuestions().subscribe(questions => {
			this.questions = questions
			this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[])

			const categoryControl = this.form.get('category');

			if (categoryControl) {
				categoryControl.valueChanges.subscribe(category => {
					this.updateFactionOptions(category);
				});
			}
		})
	}

	private updateFactionOptions(category: string) {
		const factionControl = this.form.get('subCategory');
		if (!factionControl) {
			return; // Exit early if factionControl is null
		}

		this.questionService.getFactionOptions(category).subscribe(
			options => {
				if (this.questions) {
					const factionQuestion = this.questions.find(q => q.key === 'subCategory') as DropdownQuestion;
					factionQuestion.options = options;
					factionControl.setValue(''); // Reset factionControl value
				}
			},
			error => {
				console.error('Error fetching faction options:', error);
				// Handle error gracefully (e.g., show error message to the user)
			}
		);
	}

	onPreviousStep() {
		if (this.step === 1) {
			return
		}
		this.step = this.step - 1
	}

	onNextStep() {
		if (this.step === this.questionService.maxStep) {
			return
		}
		this.step = this.step + 1
	}

	isCurrentQuestionAnswered(): boolean {
		if (!this.questions) {
			return false
		}

		// // Get the current question based on the current step
		const currentQuestion = this.questions.find(question => question.step === this.step)

		if (!currentQuestion) {
			return false
		}
		const key = currentQuestion.key

		return this.form.value.hasOwnProperty(key) && this.form.value[key] !== ''
	}

	onSubmit() {
		// console.log('form submit, link src = ')
		// console.log('https://stackblitz.com/run?file=src%2Fapp%2Fapp.component.ts')
		this.payLoad = JSON.stringify(this.form.getRawValue());
		// console.log(this.form.value)
		const userId: string | null = localStorage.getItem('userId')
		console.log(userId)
		if (userId) {
			this.dashboardService
				// TODO change faction to subcategory
				.createNewArmy(
					this.form.value.category,
					this.form.value.subCategory,
					this.form.value.name
				)
				.subscribe(
					(response) => {
						console.log(response)
					},
					(error) => {
						console.log(error)
					}
				)
		}
	}

}