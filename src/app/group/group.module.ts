import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ViewExpenseComponent } from './view-expense/view-expense.component';
import {RouterModule} from '@angular/router';
import { EditExpenseComponent } from './edit-expense/edit-expense.component'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import {DatePipe} from '@angular/common';
import { ExpenseHistoryComponent } from './expense-history/expense-history.component';
import { PendingAmountComponent } from './pending-amount/pending-amount.component'

@NgModule({
  declarations: [CreateGroupComponent, CreateExpenseComponent, ExpensesComponent, ViewExpenseComponent, EditExpenseComponent, ExpenseHistoryComponent, PendingAmountComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path:'create-expense',component:CreateExpenseComponent},
      {path:'create-group',component:CreateGroupComponent},
      {path:'expenses',component:ExpensesComponent},
      {path:'view-expense',component:ViewExpenseComponent},
      {path:'edit-expense',component:EditExpenseComponent},
      {path:'expense-history',component:ExpenseHistoryComponent},
      {path:'pending-amount',component:PendingAmountComponent}
    ])
  ],
  providers:[DatePipe]
})
export class GroupModule { }
