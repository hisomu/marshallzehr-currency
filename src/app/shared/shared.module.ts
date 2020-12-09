import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		RouterModule,
		ReactiveFormsModule,
		FlexLayoutModule
	],
	exports: [
		MaterialModule,
		RouterModule,
		ReactiveFormsModule,
		FlexLayoutModule
	]
})
export class SharedModule { }
