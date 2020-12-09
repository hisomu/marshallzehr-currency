import { TestBed } from '@angular/core/testing';

import { TrackByService } from './track-by.service';

describe('TrackByService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TrackByService = TestBed.get(TrackByService);
		expect(service)
		.toBeTruthy();
	});
});
