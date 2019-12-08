import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseHistoryComponent } from './expense-history.component';

describe('ExpenseHistoryComponent', () => {
  let component: ExpenseHistoryComponent;
  let fixture: ComponentFixture<ExpenseHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
