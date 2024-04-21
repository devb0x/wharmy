export class QuestionBase<T> {
	value: T|undefined
	key: string
	label: string
	required: boolean
	order: number
	step: number
	controlType: string
	type: string
	options: {key: string, value: string}[]

	constructor(options: {
		value?: T
		key?: string
		label?: string
		required?: boolean
		order?: number
		step?: number
		controlType?: string
		type?: string
		options?: {key: string, value: string}[]
	} = {}) {
		this.value = options.value
		this.key = options.key || ''
		this.label = options.label || ''
		this.required = !!options.required
		this.order = options.order === undefined ? 1 : options.order
		this.step = options.step === undefined ? 1 : options.step
		this.controlType = options.controlType || ''
		this.type = options.type || ''
		this.type = options.type || ''
		this.options = options.options || []
	}
}