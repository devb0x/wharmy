import {PictureInterface} from "./picture.interface";

export interface MiniatureInterface {
	_id: string
	ownerId: string
	armyId: string
	name: string
	paintsUsed: []
	miniatureGallery: PictureInterface[]

	// fileName: string
	// fileUrl: string
	// uploadDate: Date
}