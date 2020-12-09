import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConverterModule } from '@app/converter';
import { SharedModule } from '@app/shared';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		ConverterModule,

		HttpClientModule,
		ReactiveFormsModule,
		BrowserAnimationsModule
	],
	exports: [
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
