import { FooterComponent } from '@/app/footer/footer.component';
import { NavComponent } from '@/app/nav/nav.component';
import { Component } from '@angular/core';
import { LucideAngularModule, Bell, Calendar, Lock, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    LucideAngularModule,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent{
  title = 'angular-settings-app';
  
  readonly Bell = Bell;
  readonly Calendar = Calendar;
  readonly Lock = Lock;
  readonly LogOut = LogOut;
}