import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ContentChild, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChildren, ViewContainerRef, inject } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { Subject } from "rxjs";
import { AppAny } from "../../app.models";
import { DynamicFormResolverService } from "../../services/dynamic-form-resolver.service";
import { DynamicFormTemplateDirective } from "./directives/dynamic-form-template.directive";
import { DYNAMIC_FORM_TYPE, DynamicFormItem, DynamicFormItemRef } from "./dynamic-form.const";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements AfterViewInit, AfterContentInit, OnDestroy, OnInit {
    protected readonly resolver = inject(DynamicFormResolverService);
    protected readonly cd = inject(ChangeDetectorRef);
    protected readonly controlContainer = inject(ControlContainer);
    protected readonly formGroupDirective = inject(FormGroupDirective);
    
    #destroy$: Subject<null> = new Subject()

    @Input({ required: true }) fields: DynamicFormItem[] = [];

    @ContentChildren(DynamicFormTemplateDirective, { read: TemplateRef }) templates?: QueryList<TemplateRef<unknown>>;
    @ContentChildren(DynamicFormTemplateDirective) templateInputs?: QueryList<DynamicFormTemplateDirective>;
    @ContentChild('control') control?: TemplateRef<unknown>;


    get keyToRef(): Record<string, TemplateRef<unknown> | null | undefined> {
        if (!this.templates?.length || !this.templateInputs?.length) {
            return ({});
        }

        let val: Record<string, TemplateRef<unknown> | null | undefined> = {};
        for (let i = 0; i < this.templates.length; i++) {
            val[this.templateInputs.get(i)?.key as string] = this.templates.get(i);
        }
        return val;
    }

    components: DynamicFormItemRef[] = [];

    @ViewChildren('anchor', { read: ViewContainerRef }) anchors!: QueryList<ViewContainerRef>;

    readonly DYNAMIC_FORM_TYPE = DYNAMIC_FORM_TYPE;

    form: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.form = this.controlContainer.control as FormGroup;
    }

    ngOnDestroy(): void {
        this.#destroy$.next(null);
        this.#destroy$.complete();
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
        this.components = this.fields.map(f => {
            return ({
                ...f,
                ref: f.type === DYNAMIC_FORM_TYPE.CUSTOM ? this.keyToRef[f.key] : null,
                control: this.form.get(f.key) as FormControl,
            });
        })
    }

    ngAfterViewInit(): void {
        if (this.anchors.length) {
            this.#renderSupportedComponent();
        }
    }

    #renderSupportedComponent(): void {
        this.fields
            .filter(f => f.type !== DYNAMIC_FORM_TYPE.CUSTOM)
            .forEach((f, index) => {
                (this.resolver.resolve(f.type) as Promise<AppAny>).then(c => {
                    const component: ComponentRef<ControlValueAccessor> | undefined = this.anchors.get(index)?.createComponent(c);
                    const formControl: FormControl = <FormControl>this.form.get(f.key);

                    if (component) {

                        if (f.config) {
                            setComponentConfigByInput(f.config, component);
                        }
                        component.instance.writeValue(formControl.value);
                        component.instance.registerOnChange((value: AppAny) => {
                            formControl.setValue(value);
                        });
                        formControl.valueChanges.subscribe({
                            next: val => component?.instance.writeValue(val)
                        });
    
                        component.instance.registerOnTouched(() => {
                            formControl.markAsTouched();
                        });
                        formControl.registerOnDisabledChange(fn => component?.instance?.setDisabledState?.bind(fn));
                    }
                    
                })
            });

        this.cd.markForCheck();

        function setComponentConfigByInput(
            config: { [key: string]: any }, 
            componentRef: ComponentRef<ControlValueAccessor>) {
            for (const key in config) {
                componentRef.setInput(key, config[key]);
            }
        }
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