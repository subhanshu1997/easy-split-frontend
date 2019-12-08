import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAmountComponent } from './pending-amount.component';

describe('PendingAmountComponent', () => {
  let component: PendingAmountComponent;
  let fixture: ComponentFixture<PendingAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
