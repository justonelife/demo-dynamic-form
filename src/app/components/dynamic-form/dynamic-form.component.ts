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
    
    @Input({ required: true }) fields: DynamicFormItem[] = [];

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
        this.#computeComponents();
    }

    #addControlForCustomFieldOrFieldHasDefault(): void {
        this.fields
        .forEach(f => {
          this.form.addControl(f.key, new FormControl(f.value || f.defaultValue || null, f.validators?.length ? f.validators : null))
        }, this);
    }

    #computeComponents(): void {
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