import 'zone.js/dist/zone-testing'; // this import MUST be the first one in this file
// tslint:disable-next-line: ordered-imports
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
	context(path: string, deep?: boolean, filter?: RegExp): {
		keys(): Array<string>;
		<T>(id: string): T;
	};
};

// First, initialize the Angular testing environment.
getTestBed()
	.initTestEnvironment(
		BrowserDynamicTestingModule,
		platformBrowserDynamicTesting()
	);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys()
				.map(context);
