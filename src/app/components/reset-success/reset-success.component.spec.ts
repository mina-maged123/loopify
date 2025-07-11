import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSuccessComponent } from './reset-success.component';

describe('ResetSuccessComponent', () => {
  let component: ResetSuccessComponent;
  let fixture: ComponentFixture<ResetSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
