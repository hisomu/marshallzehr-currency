import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';

import { ConversionDateRange } from '@app/converter/converter.models';
import { ConverterService } from '@app/converter/services';
import { untilComponentDestroyed } from '@app/shared/component-destroyed';
import { TrackByService } from '@app/shared/services';

@Component({
	selector: 'mz-converter',
	templateUrl: './converter.component.html',
	styleUrls: ['./converter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterComponent implements OnDestroy, OnInit {
	currencyConverterForm: FormGroup;
	minDate: Date;
	maxDate = new Date();

	filteredFromCurrencies$: Observable<Array<string>>;
	filteredToCurrencies$: Observable<Array<string>>;

	isError = false;
	isToCAD = true;

	currencyDateRange$: Observable<ConversionDateRange>;

	constructor(
		private readonly cdRef: ChangeDetectorRef,
		private readonly fb: FormBuilder,
		public trackBySvc: TrackByService, /** Used in the template */
		public converterSvc: ConverterService
	) {}

	ngOnInit(): void {
		// max / min dates for the date picker
		this.currencyDateRange$ = this.converterSvc.currencyDateRange$
			.pipe(
				catchError((err, caught) => {
					this.isError = true;
					this.cdRef.detectChanges();

					return throwError(err);
				}),
				untilComponentDestroyed(this));

		this.currencyConverterForm = this.fb.group({
			amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{0,4})?$/)]],
			fromCurrency: ['CAD', [Validators.required, Validators.pattern('[a-zA-Z]{3}')]],
			toCurrency: ['', [Validators.required, Validators.pattern('[a-zA-Z]{3}')]],
			date: ['']
		});

		this.setAutocomplete('CAD', '');
	}

	ngOnDestroy(): void {
		// required to properly unsubscribe observables
	}

	// swap the foreign and canadian currencies around
	swapCurrencies(): void {
		this.currencyConverterForm = this.fb.group({
			amount: [
				this.currencyConverterForm.get('amount').value,
				[Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]
			],
			fromCurrency: [
				this.currencyConverterForm.get('toCurrency').value,
				[Validators.required, Validators.pattern('[a-zA-Z]{3}')]
			],
			toCurrency: [
				this.currencyConverterForm.get('fromCurrency').value,
				[Validators.required, Validators.pattern('[a-zA-Z]{3}')]
			],
			date: [
				this.currencyConverterForm.get('date').value
			]
		});
		this.isToCAD = !this.isToCAD;
		this.setAutocomplete(this.currencyConverterForm.controls.fromCurrency.value, this.currencyConverterForm.controls.toCurrency.value);
	}

	// send request to get conversion of selected currency
	convert(): void {
		this.converterSvc.setCurrency(this.currencyConverterForm.controls.amount.value, this.currencyConverterForm.controls.toCurrency.value, this.currencyConverterForm.controls.fromCurrency.value, this.currencyConverterForm.controls.date.value);
	}

	// initialize/reset the currency dropdwons
	private setAutocomplete(from: string, to: string): void {
		this.filteredFromCurrencies$ = this.currencyConverterForm.get('fromCurrency')
		.valueChanges
		.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			untilComponentDestroyed(this),
			startWith(from),
			switchMap((val: string) => this.filterCurrencies(val)
											.pipe(take(1))));

		this.filteredToCurrencies$ = this.currencyConverterForm.get('toCurrency')
		.valueChanges
		.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			untilComponentDestroyed(this),
			startWith(to),
			switchMap((val: string) => this.filterCurrencies(val)
											.pipe(take(1))));
	}

	// filter currencies in auto complete dropdown
	private filterCurrencies(value: string): Observable<Array<string>> {
		if (!value || typeof value !== 'string')
			return this.converterSvc.currencyList$.pipe(
				catchError((err, caught) => {
					this.isError = true;
					this.cdRef.detectChanges();

					return throwError(err);
				}));

		const filterValue = value.toUpperCase();

		return this.converterSvc.currencyList$
			.pipe(
				catchError((err, caught) => {
					this.isError = true;
					this.cdRef.detectChanges();

					return throwError(err);
				}),
				map(list => list.filter(currency => currency.indexOf(filterValue) > -1))
			);
	}
}
