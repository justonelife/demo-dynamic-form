import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
    template: ''
})
export class BaseInputComponent extends BaseComponent {
    
    onInput(): void {
        this.onChange(this.state);
    }
}