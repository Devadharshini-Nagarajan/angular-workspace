import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../budget/budget.service'; // adjust path
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor } from '@angular/common';
import { toYearMonth } from 'shared';
import { InsightsService } from './insights.service';
import { Insight, InsightsRequest } from './insights.model';

type QuestionKey =
  | 'MONTHLY_SPENDING_SUMMARY'
  | 'OVERSPEND_ANALYSIS'
  | 'TOP_SPENDING_DRIVERS'
  | 'LOW_EFFORT_WINS';

@Component({
  selector: 'app-insights',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
  public budgetService = inject(BudgetService);
  private insightsService = inject(InsightsService);

  question = new FormControl<QuestionKey>('MONTHLY_SPENDING_SUMMARY', { nonNullable: true });

  insight: Insight | null = null;
  loading = false;
  error: string | null = null;

  questions: { key: QuestionKey; label: string }[] = [
    { key: 'MONTHLY_SPENDING_SUMMARY', label: 'Explain my monthly spending' },
    { key: 'OVERSPEND_ANALYSIS', label: 'Is my budget balanced?' },
    { key: 'TOP_SPENDING_DRIVERS', label: 'What are my top spending drivers?' },
    { key: 'LOW_EFFORT_WINS', label: 'Suggest category tweaks, low-effort wins' },
  ];

  askInsight() {
    const mk = toYearMonth();

    this.loading = true;
    this.error = null;
    this.insight = null;
    const body: InsightsRequest = {
      monthKey: mk,
      questionKey: this.question.value,
    };
    this.insightsService.getInsights(body).subscribe({
      next: (res) => {
        this.insight = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to generate insight. Try again.';
        this.loading = false;
      },
    });
  }
}
