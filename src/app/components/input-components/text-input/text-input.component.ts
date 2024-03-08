import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzInputModule } from "ng-zorro-antd/input";
import { BaseInputComponent } from "../base/base-input/base-input.component";

@Component({
    selector: 'text-input',
    templateUrl: '../base/base-input/base-input.component.html',
    standalone: true,
    imports: [
        NzInputModule,
        FormsModule,
    ]
})
export class TextInputComponent extends BaseInputComponent {

}