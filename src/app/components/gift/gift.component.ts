import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Irewards } from '@/app/models/irewards';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { RewardsService } from '@/app/services/rewards.service';
import { UserProfileService } from '@/app/services/user-profile.service';
import { FooterComponent } from "@/app/footer/footer.component";
import { NavComponent } from '@/app/nav/nav.component';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorNotificationContainerComponent } from '@/app/error-notification/error-notification-container.component';
import { ErrorNotificationService } from '@/app/error-notification/error-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css'],
  imports: [CommonModule, RouterLink, NavComponent, FooterComponent, FormsModule, ErrorNotificationContainerComponent]
})
export class GiftComponent implements OnInit {
  rewards$!: Observable<Irewards[]>;
  filteredRewards$!: Observable<Irewards[]>;
  selectedRanges$ = new BehaviorSubject<string[]>([]);
  searchTerm$ = new BehaviorSubject<string>('');
  totalPoints: number = 0;
  userName: string = '';


  selectedReward: Irewards | null = null;
  selectedQuantity: number = 1;

  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' | '' = '';

  showCancelModal: boolean = false;
  selectedRewardIdToCancel: number | null = null;

  constructor(
    private rewardsService: RewardsService,
    private userProfileService: UserProfileService,
    private errorNotifyService: ErrorNotificationService
  ) { }

  ngOnInit(): void {
    this.rewards$ = this.rewardsService.getAllRewards();

    const userId = Number(localStorage.getItem('id'));
    this.userProfileService.GetUser(userId).subscribe(res => {
      this.totalPoints = res.data.totalPoints;
      this.userName = res.data.fullName;
    });

    this.filteredRewards$ = combineLatest([
      this.rewards$,
      this.selectedRanges$,
      this.searchTerm$
    ]).pipe(
      map(([rewards, ranges, searchTerm]) => {
        let filtered = rewards;
        if (ranges.length > 0) {
          filtered = filtered.filter(reward => {
            const points = reward.pointsRequired;
            return ranges.some(range => {
              if (range === '0-500') return points <= 500;
              if (range === '500-1000') return points > 500 && points <= 1000;
              if (range === '1000+') return points > 1000;
              return true;
            });
          });
        }
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
    this.selectedRanges$.next(
      checked ? [...current, range] : current.filter(r => r !== range)
    );
  }

  onCheckboxChange(range: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleRange(range, checked);
  }

  showModal(reward: Irewards) {
    this.selectedReward = reward;
    this.selectedQuantity = 1;
  }

  closeModal() {
    this.selectedReward = null;
  }

  confirmRedemption() {
    if (!this.selectedReward) return;

    const rewardId = this.selectedReward.id;
    const quantity = this.selectedQuantity;

    this.rewardsService.postRedeemReward(rewardId, quantity).subscribe({
      next: () => {
        this.feedbackMessage = "Redemption successful!";
        this.feedbackType = 'success';
        this.closeModal();
        // ممكن تعملي auto-hide للرسالة بعد ثواني:
        setTimeout(() => {
          this.feedbackMessage = '';
          this.feedbackType = '';
        }, 3000);
      },
      error: (err) => {
        this.feedbackMessage = err.error.message || "You are not allowed to redeem this reward.";
        this.feedbackType = 'error';
        this.errorNotifyService.showError({
          title: 'Error',
          message: this.feedbackMessage,
          autoDismiss: true,
          autoDismissDelay: 3000
        });
      }
    });
  }

  openCancelModal(rewardId: number) {
    this.selectedRewardIdToCancel = rewardId;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedRewardIdToCancel = null;
  }

  confirmCancel() {
    // if (this.selectedRewardIdToCancel !== null) {
    //   this.rewardsService.cancelRedeemReward(this.selectedRewardIdToCancel).subscribe({
    //     next: () => {
    //       alert("Redemption cancelled successfully.");
    //       this.closeCancelModal();
    //     },
    //     error: (err) => {
    //       alert("Error cancelling redemption: " + err.error.message);
    //       this.closeCancelModal();
    //     }
    //   });
    // }
  }
}
