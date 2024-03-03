import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NzSelectModeType, NzSelectModule } from "ng-zorro-antd/select";
import { HOBBY_OPTIONS } from "../../../app.const";
import { Hobby } from "../../../app.models";
import { BaseSelectorComponent } from "../base/base-selector/base-selector.component";

@Component({
    selector: 'hobbies-selector',
    templateUrl: '../base/base-selector/base-selector.component.html',
    standalone: true,
    imports: [
        NzSelectModule,
        FormsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: HobbiesSelectorComponent,
            multi: true,
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HobbiesSelectorComponent extends BaseSelectorComponent {
    override options: Hobby[] = HOBBY_OPTIONS;
    override mode: NzSelectModeType = 'multiple';
    protected override placeholder: string = 'Select your hobbies';
}