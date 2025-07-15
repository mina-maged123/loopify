import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSummaryCard } from './material-summary-card';

describe('MaterialSummaryCard', () => {
  let component: MaterialSummaryCard;
  let fixture: ComponentFixture<MaterialSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
