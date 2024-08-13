import { PictureInterface } from "./picture.interface"

export interface StepInterface {
	number: number
	value: string
	pictures: PictureInterface[]
}

export interface MiniatureInterface {
	_id: string
	ownerId: string
	armyId: string
	name: string
	steps: StepInterface[]
	paintsUsed: []
}