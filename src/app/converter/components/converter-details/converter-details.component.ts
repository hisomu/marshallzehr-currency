import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { ConverterService } from '@app/converter/services';
import { untilComponentDestroyed } from '@app/shared/component-destroyed';

@Component({
	selector: 'mz-converter-details',
	templateUrl: './converter-details.component.html',
	styleUrls: ['./converter-details.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterDetailsComponent implements OnDestroy {
	// result of the currency conversion to/from CAD
	conversionResult$ = this.converterSvc.conversion$
		.pipe(untilComponentDestroyed(this));

	constructor(
			private readonly converterSvc: ConverterService
		) {}

	ngOnDestroy(): void {
		// required to properly unsubscribe observables
	}

}
