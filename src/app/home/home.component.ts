import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication and redirect accordingly
    if (this.authService.isAuthenticated()) {
      console.log('🏠 Home: User authenticated, redirecting to dashboard');
      this.authService.navigateBasedOnRole();
    } else {
      console.log('🏠 Home: User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
    }
  }
}
