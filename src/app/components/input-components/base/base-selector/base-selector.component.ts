import { Component, Input } from "@angular/core";
import { BaseComponent } from "../base.component";
import { AppAny, SelectOption } from "../../../../app.models";
import { NzSelectModeType } from "ng-zorro-antd/select/select.types";

@Component({
    template: '',
})
export class BaseSelectorComponent extends BaseComponent {
    @Input() options: SelectOption<string, AppAny>[] = [];
    @Input() mode: NzSelectModeType = 'default';

    protected override placeholder: string = 'Please select';

    onSelect(): void {
        this.onChange(this.state);
    }
}