import { Injectable } from "@angular/core";
import { Observable, delay, filter, map, of } from "rxjs";
import { AppAny, SelectOption } from "../app.models";
import { TypeaheadService } from "./interfaces/typeahead-service.interface";

@Injectable()
export class LanguageService implements TypeaheadService {

    getData(value: string): Observable<SelectOption<string, AppAny>[]> {
        if (!value) return of([]);
        
        return of(LANGUAGES)
            .pipe(
                delay(200),
                map(lang => {
                    return lang.filter(v => v.label.toLowerCase().includes(value.toLowerCase()))
                }),
            );
    }

    fetchLabel(value: string | number): Observable<string> {
        return of(LANGUAGES)
            .pipe(
                delay(200),
                map(lang => {
                    const filtered = lang.filter(v => v.value === value);
                    return filtered?.length ? filtered[0].label : '';
                }),
            );
    }
}

const LANGUAGES: SelectOption<string, AppAny>[] = [
    {
        label: 'Vietnamese',
        value: 0,
    },
    {
        label: 'English',
        value: 1,
    }
]

