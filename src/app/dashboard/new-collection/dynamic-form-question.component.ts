import {Component, ElementRef, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {QuestionBase} from "./question-base";

@Component({
	standalone: true,
	selector: 'app-question',
	templateUrl: './dynamic-form-question.component.html',
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	styleUrl: './dynamic-form-question.component.css'
})
export class DynamicFormQuestionComponent {
	@Input() question!: QuestionBase<any>
	@Input() form!: FormGroup

	get isValid() {
		return this.form.controls[this.question.key].valid
	}

	isInvalid(controlName: string): boolean {
		const control = this.form.get(controlName);
		return !control || (control?.invalid && (control?.dirty || control?.touched)) || false;
	}



}