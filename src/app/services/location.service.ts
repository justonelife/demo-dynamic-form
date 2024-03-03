import { Injectable } from "@angular/core";
import { Observable, delay, map, of } from "rxjs";
import { AppAny, SelectOption } from "../app.models";
import { TypeaheadService } from "./interfaces/typeahead-service.interface";

@Injectable()
export class LocationService implements TypeaheadService {

    getData(value: string): Observable<SelectOption<string, AppAny>[]> {
        if (!value) return of([]);
        
        return of(CITIES)
            .pipe(
                delay(500),
                map((cities: SelectOption[]) => {
                    return cities.filter(c => c.label.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
                }),
            )
    }

    fetchLabel(value: string | number): Observable<string> {
        return of(CITIES)
            .pipe(
                delay(200),
                map(city => {
                    const filtered = city.filter(v => v.value === value);
                    return filtered?.length ? filtered[0].label : '';
                }),
            );
    }

}

const CITIES: SelectOption<string, AppAny>[] = [
    {
        label: 'Ho Chi Minh',
        value: 'hcm',
    },
    {
        label: 'Ha Noi',
        value: 'hn',
    }
]