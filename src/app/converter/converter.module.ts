import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule, SharedModule } from '@app/shared';

import { ConverterDetailsComponent } from './components/converter-details/converter-details.component';
import { ConverterComponent } from './components/converter/converter.component';

@NgModule({
	declarations: [ ConverterComponent, ConverterDetailsComponent ],
	imports: [
		CommonModule,
		SharedModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule
	],
	providers: [
		TitleCasePipe
	]
})
export class ConverterModule { }
