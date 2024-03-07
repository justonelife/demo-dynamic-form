import { Pipe, PipeTransform, inject } from "@angular/core";
import { Observable } from "rxjs";
import { TYPEAHEAD_SERVICE } from "../services/interfaces/typeahead-service.interface";

@Pipe({
    name: 'typeaheadLabel',
    standalone: true,
})
export class TypeaheadLabelPipe implements PipeTransform {
    readonly typeaheadService = inject(TYPEAHEAD_SERVICE, { skipSelf: true });
    
    transform(value: string | number): Observable<string> {
        return this.typeaheadService.fetchLabel(value);
    }
}