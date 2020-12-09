import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Moment } from 'moment';
// tslint:disable-next-line: no-duplicate-imports
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay, switchMap } from 'rxjs/operators';

import { ConversionDateRange, ConversionResult } from '@app/converter';

@Injectable({
	providedIn: 'root'
})
export class ConverterService {
	dailyAvg$ = this.httpClient
		.get('https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json')
		.pipe(
			shareReplay({ bufferSize: 1, refCount: true })
		);
	private readonly currencyAmount$ = new BehaviorSubject<number>(1);
	private readonly currencyTo$ = new BehaviorSubject<string>(undefined);
	private readonly currencyFrom$ = new BehaviorSubject<string>('CAD');
	private readonly conversionDate$ = new BehaviorSubject<Moment>(moment());

	// tslint:disable: member-ordering
	// if any value changes (amount, currency from, currency to, date) pull the rate and returns ConversionResult
	conversion$ = combineLatest([
		this.currencyAmount$.pipe(distinctUntilChanged()),
		this.currencyFrom$.pipe(distinctUntilChanged()),
		this.currencyTo$.pipe(distinctUntilChanged()),
		this.conversionDate$.pipe(distinctUntilChanged())
	])
	.pipe(
		switchMap(([currencyAmount, currencyFrom, currencyTo, date]) => {
			if (currencyAmount && currencyFrom && currencyTo)
				return this.dailyAvg$.pipe(
					map(avg => {
						if (!avg)
							return undefined;

						const conversionDate = date ? date.toDate() : new Date();
						let dateString = conversionDate.toLocaleDateString('en-CA', {timeZone: 'America/Toronto'});
						let dailyRates = avg['observations'].find(e => e.d === dateString);

						// if there are no rates, based on users selected date, check the previous business day
						if (!dailyRates) {
							if (conversionDate.getDay() === 1)
								conversionDate.setDate(conversionDate.getDate() - 3);
							else if (conversionDate.getDay() === 0)
								conversionDate.setDate(conversionDate.getDate() - 2);
							else
								conversionDate.setDate(conversionDate.getDate() - 1);

							dateString = conversionDate.toLocaleDateString('en-CA', {timeZone: 'America/Toronto'});
							dailyRates = avg['observations'].find(e => e.d === dateString);

							// if we can't find any rates based on the previous business day return no results
							if (!dailyRates)
								return {
									amount: currencyAmount,
									result: -1,
									from: currencyFrom,
									fromRate: undefined,
									to: currencyTo,
									toRate: undefined,
									date: conversionDate
								} as ConversionResult;
						}

					 let dollarRate = currencyFrom === 'CAD' ? dailyRates[`FX${currencyTo}CAD`] : dailyRates[`FX${currencyFrom}CAD`];
					 // if we can't find rate based on selected currency, return no results
					 if (!dollarRate)
						return {
							amount: currencyAmount,
							result: -1,
							from: currencyFrom,
							fromRate: undefined,
							to: currencyTo,
							toRate: undefined,
							date: conversionDate
						} as ConversionResult;

					 dollarRate = dollarRate.v;
					 const fromRate = currencyFrom === 'CAD' ? 1 / dollarRate : dollarRate;
					 const toRate = currencyFrom === 'CAD' ? dollarRate : 1 / dollarRate;

					 return {
							amount: currencyAmount,
							result: currencyAmount * fromRate,
							from: currencyFrom,
							fromRate,
							to: currencyTo,
							toRate,
							date: conversionDate
						} as ConversionResult;
					})
				);

			return of(undefined);
		}),
		shareReplay(1)
	) as Observable<ConversionResult>;

	// list of currencies, will be used to populate dropdown
	currencyList$ = this.httpClient
		.get('https://www.bankofcanada.ca/valet/groups/FX_RATES_DAILY/json')
		.pipe(
			shareReplay({ bufferSize: 1, refCount: true }),
			pluck('groupDetails', 'groupSeries'),
			map(series => Object.keys(series)),
			map(result =>
				result.map(x => {
					const re = /^FX([A-Z]{3})([A-Z]{3})$/;
					const matches  = x.match(re);

					return matches.find(e => e.indexOf('CAD') === -1);
				})
				.sort())
		);

	// returns max / min of date from daily avg api. Will be used to set min / max of date picker
	currencyDateRange$ = this.dailyAvg$
							.pipe(
								map(avg => {
									const observations = avg['observations'];

									const minDate = observations[0].d;
									const maxDate = observations[observations.length - 1].d;

									return {
										min: minDate,
										max: maxDate
									} as ConversionDateRange;
								})
							);
	// tslint:enable: member-ordering

	constructor(
		protected httpClient: HttpClient
	) {}

	setCurrency = (amount: number, to: string, from: string, date: Moment): void => {
		this.currencyAmount$.next(amount);
		this.currencyTo$.next(to);
		this.currencyFrom$.next(from);
		this.conversionDate$.next(date);
	};
}
