import {Component, Input, OnInit} from "@angular/core";
import {QuestionControlService} from "./question-control.service";
import {CommonModule} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms"
import {QuestionBase} from "./question-base";
import {DynamicFormQuestionComponent} from "./dynamic-form-question.component";
import {QuestionService} from "./question.service";

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

	constructor(private qcs: QuestionControlService, private questionService: QuestionService) {}

	ngOnInit() {
		this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[])
	}

	onPreviousStep() {
		if (this.step === 1) {
			return
		}
		this.step = this.step - 1
	}

	onNextStep() {
		// console.log(this.form.value)
		console.log(Object.values(Object.values(this.form?[12]: 'zz') ))
		// console.log(this.questions?[this.step - 1] : 'ok')
		// console.log(this.questions)
		// console.log(this.questions?[0] : '')
		if (this.step === this.questionService.maxStep) {
			return
		}
		this.step = this.step + 1
	}

	onSubmit() {
		console.log('form submit, link src = ')
		console.log('https://stackblitz.com/run?file=src%2Fapp%2Fapp.component.ts')
		this.payLoad = JSON.stringify(this.form.getRawValue());
	}

}