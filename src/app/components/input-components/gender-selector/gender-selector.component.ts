import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { GENDER_OPTIONS } from "../../../app.const";
import { BaseSelectorComponent } from "../base/base-selector/base-selector.component";
import { Gender } from "../../../app.models";

@Component({
    selector: 'gender-selector',
    templateUrl: '../base/base-selector/base-selector.component.html',
    standalone: true,
    imports: [
        NzSelectModule,
        FormsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: GenderSelectorComponent,
            multi: true,
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderSelectorComponent extends BaseSelectorComponent {
    override options: Gender[] = GENDER_OPTIONS;
    protected override placeholder: string = 'Select gender';
}