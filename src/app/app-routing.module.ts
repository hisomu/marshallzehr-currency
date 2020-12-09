import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConverterComponent } from './converter/components/converter/converter.component';

const routes: Routes = [
	{
		path: '',

		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'converter' },

			// birthdays
			{ path: 'converter', component: ConverterComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
