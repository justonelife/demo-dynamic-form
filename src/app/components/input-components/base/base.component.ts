import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { DYNAMIC_CONTROL } from "../../dynamic-form/dynamic-form.const";
import { Subject, distinctUntilChanged, takeUntil } from "rxjs";

@Component({
    template: '',
})
export class BaseComponent implements ControlValueAccessor, OnInit, OnDestroy {
    protected readonly cd = inject(ChangeDetectorRef);
    protected readonly dynamicControl = inject(DYNAMIC_CONTROL, { optional: true });

    protected placeholder: string = '...';
    protected state: unknown;

    onChange = (v: unknown) => {
        this.dynamicControl?.setValue(v);
    };
    onTouched = () => {};
    protected disabled: boolean = false;

    #destroy$ = new Subject();

    ngOnInit(): void {
        if (this.dynamicControl) {
            this.dynamicControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.#destroy$)
            )
            .subscribe(val => {
                this.writeValue(val);
            });

            this.dynamicControl.registerOnDisabledChange((isDisabled) => {
                if (this.setDisabledState) {
                    this.setDisabledState(isDisabled);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.#destroy$.next(null);
        this.#destroy$.complete();
    }

    writeValue(val: unknown): void {
        this.state = val;
        this.cd.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    }
    
}