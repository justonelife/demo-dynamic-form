import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewChildren, ViewContainerRef, inject } from "@angular/core";
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { AppAny } from "../../app.models";
import { DynamicFormResolverService } from "../../services/dynamic-form-resolver.service";
import { DynamicFormTemplateDirective } from "./directives/dynamic-form-template.directive";
import { DYNAMIC_FORM_TYPE, DynamicFormItem, DynamicFormItemRef } from "./dynamic-form.const";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements AfterContentInit, OnInit {
    protected readonly resolver = inject(DynamicFormResolverService);
    protected readonly controlContainer = inject(ControlContainer);
    protected readonly formGroupDirective = inject(FormGroupDirective);
    
    fields: DynamicFormItem[] = [];
    get _fields(): DynamicFormItem[] {
        return this.fields;
    }
    @Input({ alias: 'fields', required: true }) set _fields(v: DynamicFormItem[]) {
        this.fields = v;
        this.#addControlForCustomFieldOrFieldHasDefault();
        this.#computeFieldRefs();
    }

    @ContentChildren(DynamicFormTemplateDirective, { read: TemplateRef }) templates!: QueryList<TemplateRef<unknown>>;
    @ContentChildren(DynamicFormTemplateDirective) templateInputs?: QueryList<DynamicFormTemplateDirective>;
    @ContentChild('control') control?: TemplateRef<unknown>;


    get keyToRef(): Record<string, TemplateRef<unknown>> {
        if (!this.templates?.length || !this.templateInputs?.length) {
            return ({});
        }

        let val: Record<string, TemplateRef<unknown>> = {};
        for (let i = 0; i < this.templates.length; i++) {
            val[this.templateInputs.get(i)?.key as string] = this.templates.get(i) as TemplateRef<unknown>;
        }
        return val;
    }

    fieldRefs: DynamicFormItemRef[] = [];

    readonly DYNAMIC_FORM_TYPE = DYNAMIC_FORM_TYPE;

    form: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.form = this.controlContainer.control as FormGroup;
    }

    ngAfterContentInit(): void {
        this.#addControlForCustomFieldOrFieldHasDefault();
        this.#computeFieldRefs();
    }

    #addControlForCustomFieldOrFieldHasDefault(): void {
        this.fields
        .forEach(f => {
            if (this.form.controls[f.key]) {
                // Already existed
                return;
            }

            this.form.addControl(f.key, new FormControl({
                value: f.value || f.defaultValue || null,
                disabled: f.disabled,
            }, 
            f.validators?.length ? f.validators : null
        ))
        }, this);
    }

    #computeFieldRefs(): void {
        this.fieldRefs = this.fields.map(f => {
            return ({
                ...f,
                ref: this.keyToRef[f.key],
                comp: this.resolver.resolve(f.type),
                control: this.form.get(f.key) as FormControl,
            });
        });
    }

    onReset(): void {
        // Only work with default control
        const defaultValues: Record<string, AppAny> = this.fields.filter(f => {
            return f.defaultValue !== undefined;
        })
        .reduce((acc, cur) => ({ ...acc, [cur.key]: cur.defaultValue }), {})
        
        this.form.reset(defaultValues);
    }

    onSubmit(event: Event): void {
        if (this.form.invalid) {
            return;
        }
        this.formGroupDirective.onSubmit(event);
    }
}