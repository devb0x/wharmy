import { PictureInterface } from "./picture.interface"

export interface StepInterface {
	_id?: string
	number: number
	title: string
	description: string
	paintsUsed: []
	pictures: PictureInterface[]
}

export interface MiniatureInterface {
	_id?: string
	ownerId?: string
	armyId?: string
	name: string
	steps: StepInterface[]
	paintsUsed: []
}