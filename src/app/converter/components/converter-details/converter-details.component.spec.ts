import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterDetailsComponent } from './converter-details.component';

describe('ConverterDetailsComponent', () => {
	let component: ConverterDetailsComponent;
	let fixture: ComponentFixture<ConverterDetailsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ConverterDetailsComponent ],
			imports: [
				HttpClientTestingModule
			]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConverterDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
