import { Observable } from "rxjs";
import { SelectOption } from "../../app.models";
import { InjectionToken } from "@angular/core";

export interface TypeaheadService {
    getData(value: string): Observable<SelectOption[]>;
    fetchLabel(value: string | number): Observable<string>;
}

export const TYPEAHEAD_SERVICE = new InjectionToken<TypeaheadService>('TYPEAHEAD_SERVICE');