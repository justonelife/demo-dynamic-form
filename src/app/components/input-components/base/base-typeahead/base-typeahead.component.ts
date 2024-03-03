import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, finalize, of, switchMap } from "rxjs";
import { AppAny, SelectOption } from "../../../../app.models";
import { TYPEAHEAD_SERVICE } from "../../../../services/interfaces/typeahead-service.interface";
import { BaseComponent } from "../base.component";

@Component({
    template: '',
})
export class BaseTypeaheadComponent extends BaseComponent {
    protected typeaheadService = inject(TYPEAHEAD_SERVICE);

    protected override placeholder: string = 'Search';
    protected search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    protected options: SelectOption<string, AppAny>[] = [];
    protected override state: string | number = '';

    constructor() {
        super();
        this.search$
        .pipe(
            debounceTime(200),
            switchMap(value => {
                return this.typeaheadService.getData(value)
                    .pipe(
                        finalize(() => {
                            this.cd.markForCheck();
                        }),
                        catchError(err => {
                            console.error(err);
                            return of([]);
                        }),
                    );
            }),
            takeUntilDestroyed()   
        )
        .subscribe(res => {
            this.options = res;
        });
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.search$.next(value);
    }

    onSelect(event: AppAny): void {
        this.search$.next('');
        this.state = event;
        this.onChange(event);
    }
}