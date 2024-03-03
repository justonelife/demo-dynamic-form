import { Directive, Input } from "@angular/core";

@Directive({
    selector: 'ng-template[dynamicFormTemplate]',
})
export class DynamicFormTemplateDirective {
    @Input('dynamicFormTemplate') key?: string;
}