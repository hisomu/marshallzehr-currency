import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

/** A service which contains a number of trackBy functions to be used with ngFors throughout the program */
/** EVERY instance of ngFor should be accompanied by a trackBy function of some sort */
export class TrackByService {

	/** Should be used to track basic datatypes (ex. string) */
	trackByAny(index, item): any {
		if (item.id)
			return item.id;
		if (item.key)
			return item.key;
		if (item.name)
			return item.name;

		return item ? index : undefined;
	}
}
