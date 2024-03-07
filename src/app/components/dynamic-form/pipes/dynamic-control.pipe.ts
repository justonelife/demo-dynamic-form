import { Injector, Pipe, PipeTransform, inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DYNAMIC_CONTROL } from "../dynamic-form.const";

@Pipe({
    name: 'dynamicControl',
})
export class DynamicControlPipe implements PipeTransform {
    readonly injector = inject(Injector);

    transform(control: FormControl) {
        return Injector.create({
            providers: [{
                provide: DYNAMIC_CONTROL,
                useValue: control
            }],
            parent: this.injector,
        });
    }

}