import { JsonPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControlStatus, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzInputModule } from "ng-zorro-antd/input";
import { AppAny } from "../../app.models";
import { DYNAMIC_FORM_TYPE, DynamicFormItem } from "../dynamic-form/dynamic-form.const";
import { DynamicFormModule } from "../dynamic-form/dynamic-form.module";
import { GENDERS, HOBBIES } from "../../app.const";

@Component({
    selector: 'my-form',
    templateUrl: './my-form.component.html',
    standalone: true,
    imports: [
        DynamicFormModule,
        NzInputModule,
        NzCheckboxModule,
        NzButtonModule,
        ReactiveFormsModule,
        JsonPipe,
        NgClass,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormComponent {
    form: FormGroup = new FormGroup({});

    submitValue: Record<string, AppAny> = {};

    readonly FIELDS: DynamicFormItem[] = [
        { key: 'username', label: 'Username', type: DYNAMIC_FORM_TYPE.TEXT_INPUT, klass: 'col-span-12', validators: [Validators.required, Validators.minLength(6)] },
        { key: 'name', label: 'Name', type: DYNAMIC_FORM_TYPE.TEXT_INPUT, klass: 'col-span-12' },
        { key: 'gender', label: 'Gender', type: DYNAMIC_FORM_TYPE.GENDER_SELECTOR, klass: 'col-span-6', validators: [Validators.required] },
        { key: 'married', label: 'Married?', type: DYNAMIC_FORM_TYPE.CUSTOM, klass: 'col-span-6' },
        { key: 'age', label: 'Age', type: DYNAMIC_FORM_TYPE.CUSTOM, klass: 'col-span-6', validators: [Validators.pattern(/\d+/)], defaultValue: 18 },
        { key: 'hobbies', label: 'Hobbies', type: DYNAMIC_FORM_TYPE.HOBBIES_SELECTOR, klass: 'col-span-6', validators: [Validators.minLength(2)] },
        { key: 'city', label: 'City', type: DYNAMIC_FORM_TYPE.LOCATION_TYPEAHEAD, klass: 'col-span-12' },
        { key: 'language', label: 'Language', type: DYNAMIC_FORM_TYPE.LANGUAGE_TYPEAHEAD, klass: 'col-span-12', validators: [Validators.required] },
    ];

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        this.submitValue = this.form.value;
    }

    onReset(): void {
        this.form.reset({
            age: 18
        });        
    }

    onPatch(): void {
        this.form.patchValue({
            username: 'banhbonglan',
            gender: GENDERS.MALE,
            age: 26,
            hobbies: [HOBBIES.FOOTBALL, HOBBIES.DRAWING],
            city: 'hcm',
            language: 1
        });
    }
}