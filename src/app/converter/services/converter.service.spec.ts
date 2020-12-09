import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConverterService } from './converter.service';


describe('ConverterService', () => {
	let service: ConverterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			]
		});
		service = TestBed.inject(ConverterService);
	});

	it('should be created', () => {
		expect(service)
			.toBeTruthy();
	});

	it('should accept undefined from result', (done: DoneFn) => {
		service['dailyAvg$'] = of(undefined);
		service['currencyAmount$'].next(1);
		service['currencyTo$'].next('AUD');

		service.conversion$.subscribe(val => {
			expect(val)
				.toBeUndefined();
			done();
		});
	});

	xit('should get latest avg', (done: DoneFn) => {
		// service['dailyAvg$'] = of(getMockedDailyAvg());
		service['currencyAmount$'].next(1);
		service['currencyTo$'].next('AUD');

		service.conversion$.subscribe(val => {
			expect(val.date)
				.toEqual(new Date(2020, 12, 4));
			done();
		});
	});
});
