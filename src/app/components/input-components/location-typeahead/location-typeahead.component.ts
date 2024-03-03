import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from "ng-zorro-antd/input";
import { TYPEAHEAD_SERVICE } from "../../../services/interfaces/typeahead-service.interface";
import { LocationService } from "../../../services/location.service";
import { BaseTypeaheadComponent } from "../base/base-typeahead/base-typeahead.component";
import { TypeaheadLabelPipe } from "../../../pipes/typeahead-label.pipe";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'location-typeahead',
    templateUrl: '../base/base-typeahead/base-typeahead.component.html',
    standalone: true,
    imports: [
        NzAutocompleteModule,
        NzInputModule,
        FormsModule,
        TypeaheadLabelPipe,
        AsyncPipe,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: LocationTypeaheadComponent,
            multi: true,
        },
        {
            provide: TYPEAHEAD_SERVICE,
            useClass: LocationService,
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationTypeaheadComponent extends BaseTypeaheadComponent {
    protected override placeholder: string = 'Search city';
}