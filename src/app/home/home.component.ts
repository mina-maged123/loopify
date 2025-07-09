import { Component , ViewEncapsulation} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'app-home',
    imports: [RouterModule, NavComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

}
