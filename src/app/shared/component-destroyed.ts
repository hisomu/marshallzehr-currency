import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
 Observable that can be subscribed to that watches for the passed in component's ngOnDestroy and pushes 'true' to the stream
*/
export function componentDestroyed(component: { ngOnDestroy(): void }): Observable<true> {

	// tslint:disable-next-line:member-ordering
	const modifiedComponent = component as { ngOnDestroy(): void, __componentDestroyed$?: Observable<true> };
	// tslint:disable-next-line: no-unbound-method
	const oldNgOnDestroy = component.ngOnDestroy;
	const stop$ = new ReplaySubject<true>();

	if (modifiedComponent.__componentDestroyed$)
		return modifiedComponent.__componentDestroyed$;

	modifiedComponent.ngOnDestroy = () => {
		oldNgOnDestroy && oldNgOnDestroy.apply(component);
		stop$.next(true);
		stop$.complete();
	};

	return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
}

/* An RxJS pipe that uses takeUntil to automatically unsubscribe once the passed in component is destroyed */
export function untilComponentDestroyed<T>(component: { ngOnDestroy(): void }): (source: Observable<T>) => Observable<T> {
	return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
