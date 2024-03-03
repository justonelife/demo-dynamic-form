import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StaticFormComponent } from './components/static-form/static-form.component';
import { MyFormComponent } from './components/my-form/my-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    StaticFormComponent,
    MyFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
