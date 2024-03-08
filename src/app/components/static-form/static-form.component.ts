import { JsonPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GENDERS, GENDER_OPTIONS, HOBBIES } from "../../app.const";
import { GenderSelectorComponent } from "../input-components/gender-selector/gender-selector.component";
import { HobbiesSelectorComponent } from "../input-components/hobbies-selector/hobbies-selector.component";
import { LanguageTypeaheadComponent } from "../input-components/language-typeahead/language-typeahead.component";
import { LocationTypeaheadComponent } from "../input-components/location-typeahead/location-typeahead.component";
import { AppAny } from "../../app.models";

@Component({
    selector: 'static-form',
    templateUrl: './static-form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NzInputModule,
        NzCheckboxModule,
        NzButtonModule,
        GenderSelectorComponent,
        HobbiesSelectorComponent,
        LocationTypeaheadComponent,
        LanguageTypeaheadComponent,
        JsonPipe,
        NgClass,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticFormComponent {

    readonly GENDER_OPTIONS = GENDER_OPTIONS;
    submitValue: Record<string, AppAny> = {};
    showMore: boolean = false;

    form: FormGroup = new FormGroup({
        username: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
        name: new FormControl(''),
        gender: new FormControl(null, Validators.required),
        married: new FormControl<boolean>(false),
        age: new FormControl(18, [Validators.required, Validators.pattern(/\d+/)]),
        hobbies: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        city: new FormControl(null),
    });

    onLoadMore(): void {
        if (!this.showMore) {
            this.form.addControl('language', new FormControl(null, Validators.required));
            this.showMore = true;
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        this.submitValue = this.form.value;
    }

    onPatch(): void {
        this.form.patchValue({
            username: 'banhbonglan',
            gender: GENDERS.MALE,
            age: 26,
            hobbies: [HOBBIES.FOOTBALL, HOBBIES.DRAWING],
            city: 'hcm',
        });
    }

    onReset(): void {
        this.form.reset({ age: 18 });
    }
}