import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ContentChild, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList, TemplateRef, ViewChildren, ViewContainerRef, inject } from "@angular/core";
import { DYNAMIC_FORM_TYPE, DynamicFormItem, DynamicFormItemRef } from "./dynamic-form.const";
import { DynamicFormResolverService } from "../../services/dynamic-form-resolver.service";
import { DynamicFormTemplateDirective } from "./directives/dynamic-form-template.directive";
import { ControlValueAccessor, FormControl, FormControlStatus, FormGroup } from "@angular/forms";
import { AppAny } from "../../app.models";
import { Subject, distinctUntilChanged, takeUntil } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements AfterViewInit, AfterContentInit, OnDestroy {
    protected readonly resolver = inject(DynamicFormResolverService);
    protected readonly cd = inject(ChangeDetectorRef);

    #destroy$: Subject<null> = new Subject()

    @Output('onSubmit') submit = new EventEmitter(); 
    @Output() onStatusChange = new EventEmitter<FormControlStatus>();

    @Input({ required: true }) fields: DynamicFormItem[] = [];
    @Input('resetTrigger') resetTrigger$?: Subject<null>;
    @Input('patchTrigger') patchTrigger$?: Subject<Record<any, AppAny>>;

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

    constructor() {
        this.form.statusChanges
            .pipe(
                distinctUntilChanged(),
                takeUntilDestroyed(),
            )
            .subscribe(val => {
                this.onStatusChange.emit(val);
            });
    }

    ngOnDestroy(): void {
        this.#destroy$.next(null);
        this.#destroy$.complete();
    }

    ngAfterContentInit(): void {
        this.#addControlForCustomFieldOrFieldHasDefault();
        this.#computeComponents();
        if (this.resetTrigger$) {
            this.#listenResetTrigger();
        }
        if (this.patchTrigger$) {
            this.#listenPatchTrigger();
        }
    }

    #listenResetTrigger(): void {
        this.resetTrigger$?.pipe(
            takeUntil(this.#destroy$)
        ).subscribe(_ => {
            this.onReset();
        });
    }

    #listenPatchTrigger(): void {
        this.patchTrigger$?.pipe(
            takeUntil(this.#destroy$)
        ).subscribe(val => {
            if (!val) {
                return;
            }
            this.form.patchValue(val);
        });
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

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        this.submit.emit(this.form.value);
    }
}