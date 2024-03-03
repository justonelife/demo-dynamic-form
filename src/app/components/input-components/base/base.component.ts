import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Component({
    template: '',
})
export class BaseComponent implements ControlValueAccessor {
    protected readonly cd = inject(ChangeDetectorRef);

    protected placeholder: string = '...';
    protected state: unknown;

    onChange = (v: unknown) => {};
    onTouched = () => {};
    protected disabled: boolean = false;

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