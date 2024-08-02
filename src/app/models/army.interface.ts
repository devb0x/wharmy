import { Miniature } from "./miniature.interface"

export interface Army {
	_id: string
	ownerId: string
	name: string
	category: string
	subCategory: string
	thumbnailUrl: string
	miniatures: Miniature[]
	lore: string
	description: string
}