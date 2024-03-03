import { FormControl, ValidatorFn } from '@angular/forms';
import { AppAny } from '../../app.models';
import { ComponentRef, TemplateRef } from '@angular/core';

export enum DYNAMIC_FORM_TYPE {
    GENDER_SELECTOR,
    HOBBIES_SELECTOR,
    LANGUAGE_TYPEAHEAD,
    LOCATION_TYPEAHEAD,
    CUSTOM,
}

export class DynamicFormResolver {
    private static instance: DynamicFormResolver;
    
    private constructor() {}

    public static getInstace(): DynamicFormResolver {
        return this.instance || (this.instance = new this());
    }

    genderSelector(): Promise<AppAny> {
        return import('../input-components/gender-selector/gender-selector.component').then(c => c.GenderSelectorComponent);
    }

    hobbiesSelector(): Promise<AppAny> {
        return import('../input-components/hobbies-selector/hobbies-selector.component').then(c => c.HobbiesSelectorComponent);
    }

    locationTypeahead(): Promise<AppAny> {
        return import('../input-components/location-typeahead/location-typeahead.component').then(c => c.LocationTypeaheadComponent);
    }

    languageTypeahead(): Promise<AppAny> {
        return import('../input-components/language-typeahead/language-typeahead.component').then(c => c.LanguageTypeaheadComponent);
    }
}

export interface DynamicFormItem {
    key: string;
    type: DYNAMIC_FORM_TYPE;
    label: string;
    klass?: string;
    defaultValue?: AppAny;
    value?: AppAny;
    validators?: ValidatorFn[];
    config?: Record<string, AppAny>;
}

export interface DynamicFormItemRef extends DynamicFormItem {
    ref: TemplateRef<unknown> | null | undefined;
    control: FormControl;
}