import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable, of } from 'rxjs';

import { ConversionDateRange } from '@app/converter';
import { ConverterService } from '@app/converter/services';
import { MaterialModule } from '@app/shared';

import { ConverterComponent } from './converter.component';

class MockConverterService {
	currencyList$ = of(['AUG', 'GCP']);
	get currencyDateRange$(): Observable<ConversionDateRange> {
		return of({ min: new Date(), max: new Date() } as ConversionDateRange);
	}
}

describe('ConverterComponent', () => {
	let component: ConverterComponent;
	let fixture: ComponentFixture<ConverterComponent>;
	let mockConverterService;

	beforeEach(async () => {
		mockConverterService = jasmine.createSpyObj(['currencyDateRange$', 'currencyList$']);
		mockConverterService.currencyDateRange$.and.returnValue(of(undefined));
		mockConverterService.currencyList$.and.returnValue(of(undefined));

		await TestBed.configureTestingModule({
			declarations: [ ConverterComponent ],
			imports: [
				HttpClientTestingModule,
				MaterialModule,
				NoopAnimationsModule,
				ReactiveFormsModule
			],
			providers: [
				FormBuilder,
				{ provide: ConverterService, useClass: MockConverterService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConverterComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component)
			.toBeTruthy();
	});

	it('should show complete state', fakeAsync(() => {
		fixture.detectChanges();
		const de = fixture.debugElement.query(By.css('.converter-container'));

		expect(de.nativeElement)
			.toBeTruthy();
	}));

	it('should show ERROR state', fakeAsync(() => {
		component.isError = true;
		fixture.detectChanges();

		const de = fixture.debugElement.query(By.css('.error'));

		expect(de.nativeElement)
			.toBeTruthy();
	}));

	it('should show LOADING state', fakeAsync(() => {
		const dService = TestBed.inject(ConverterService);
		spyOnProperty(dService, 'currencyDateRange$').and
			.returnValue(of(undefined));
		fixture.detectChanges();

		const de = fixture.debugElement.query(By.css('.loading'));

		expect(de.nativeElement)
			.toBeTruthy();
	}));
});
