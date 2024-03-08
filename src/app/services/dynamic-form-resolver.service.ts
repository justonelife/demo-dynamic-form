import { Injectable } from "@angular/core";
import { DYNAMIC_FORM_TYPE, DynamicFormResolver } from "../components/dynamic-form/dynamic-form.const";
import { AppAny } from "../app.models";

@Injectable({
    providedIn: 'root'
})
export class DynamicFormResolverService {
    #resolver = DynamicFormResolver.getInstace();

    resolve(type: DYNAMIC_FORM_TYPE): Promise<AppAny> | undefined {
        switch (type) {
            case DYNAMIC_FORM_TYPE.GENDER_SELECTOR:
                return this.#resolver.genderSelector();
            case DYNAMIC_FORM_TYPE.HOBBIES_SELECTOR:
                return this.#resolver.hobbiesSelector();
            case DYNAMIC_FORM_TYPE.LOCATION_TYPEAHEAD:
                return this.#resolver.locationTypeahead();
            case DYNAMIC_FORM_TYPE.LANGUAGE_TYPEAHEAD:
                return this.#resolver.languageTypeahead();
            case DYNAMIC_FORM_TYPE.TEXT_INPUT:
                return this.#resolver.textInput();
            default:
                return undefined;
        }
    }
}