import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { Irewards } from '@/app/models/irewards';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { RewardsService } from '@/app/services/rewards.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavComponent, FooterComponent],
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {

  rewards$!: Observable<Irewards[]>;
  filteredRewards$!: Observable<Irewards[]>;
  selectedRanges$ = new BehaviorSubject<string[]>([]);
  searchTerm$ = new BehaviorSubject<string>(''); // البحث
  totalQuantity: number = 0;
userName: string = '';
  constructor(private rewardsService: RewardsService) {}

  ngOnInit(): void {
    this.rewards$ = this.rewardsService.getAllRewards();
 this.rewardsService.getTotalPoint().subscribe(data => {
    this.totalQuantity = data.totalQuantity;
    this.userName = data.name;
  });
    this.filteredRewards$ = combineLatest([
      this.rewards$,
      this.selectedRanges$,
      this.searchTerm$
    ]).pipe(
      map(([rewards, ranges, searchTerm]) => {
        let filtered = rewards;

        // فلترة حسب الرينج
        if (ranges.length > 0) {
          filtered = filtered.filter(reward => {
            const points = reward.pointsRequired;
            return ranges.some(range => {
              if (range === '0-500') return points >= 0 && points <= 500;
              if (range === '500-1000') return points > 500 && points <= 1000;
              if (range === '1000+') return points > 1000;
              return true;
            });
          });
        }

        // فلترة حسب الـ title
        if (searchTerm.trim() !== '') {
          filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return filtered;
      })
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }

  toggleRange(range: string, checked: boolean): void {
    const current = this.selectedRanges$.value;
    if (checked) {
      this.selectedRanges$.next([...current, range]);
    } else {
      this.selectedRanges$.next(current.filter(r => r !== range));
    }
  }

  onCheckboxChange(range: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleRange(range, checked);
  }
}
