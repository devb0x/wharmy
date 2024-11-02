import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {forkJoin} from "rxjs";

import {SearchService} from "../../services/search.service";

@Component({
	selector: 'app-search-results',
	standalone: true,
	imports: [],
	templateUrl: './search-results.component.html',
	styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

	constructor(
		private activatedRoute: ActivatedRoute,
		private searchService: SearchService
	) {}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params => {
				const query = params['query']; // Access the 'query' parameter

				const searchObservables = [
					this.searchService.searchArmies(query),
					this.searchService.searchMiniatures(query),
					this.searchService.searchUsers(query)
				]

			forkJoin(searchObservables).subscribe(
				([armies, miniatures ,users]) => {
					console.log('Armies: ', armies)
					console.log('Miniatures: ', miniatures)
					console.log('Users: ', users)
				},
				(error) => {
					console.error('Error fetching search results:', error);
				}
			)
		});

	}

}
