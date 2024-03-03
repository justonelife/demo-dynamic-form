import { NgModule } from "@angular/core";
import { DynamicFormComponent } from "./dynamic-form.component";
import { DynamicFormTemplateDirective } from "./directives/dynamic-form-template.directive";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";

@NgModule({
    declarations: [
        DynamicFormComponent,
        DynamicFormTemplateDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzButtonModule,
    ],
    exports: [
        DynamicFormComponent,
        DynamicFormTemplateDirective,
    ]
})
export class DynamicFormModule {}