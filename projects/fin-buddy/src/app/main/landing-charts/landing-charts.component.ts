import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { NgIf } from '@angular/common';
import { BudgetService } from '../../budget/budget.service';
import { toYearMonth } from 'shared';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/* eslint-disable @typescript-eslint/no-explicit-any */
interface chartData {
  pie: any;
  categoriesStacked: any;
}
@Component({
  selector: 'app-landing-charts',
  standalone: true,
  imports: [NgIf, BaseChartDirective],
  templateUrl: './landing-charts.component.html',
  styleUrl: './landing-charts.component.scss',
})
export class LandingChartsComponent implements OnInit {
  private http = inject(HttpClient);
  private budgetService = inject(BudgetService);

  loading = false;
  apiData: chartData | null = null;

  pieData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  stackedData: ChartData<'bar'> = { labels: [], datasets: [] };
  stackedOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          afterBody: (items: TooltipItem<'bar'>[]) => {
            const idx = items?.[0]?.dataIndex ?? -1;
            const row = this.apiData?.categoriesStacked?.[idx];
            if (!row) return '';

            const lines = [
              `Limit: ${row.limit}`,
              `Spent: ${row.spent}`,
              `Remaining: ${Math.max(row.limit - row.spent, 0)}`,
            ];
            if (row.over > 0) lines.push(`Over: ${row.over}`);
            return lines;
          },
        },
      },
    },
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true },
    },
  };

  ngOnInit() {
    const mk = toYearMonth();
    this.fetchCharts(mk);
  }

  fetchCharts(monthKey: string) {
    this.loading = true;

    this.http
      .get<chartData>('http://localhost:3000/api/charts/monthly', { params: { monthKey } })
      .subscribe({
        next: (res) => {
          this.apiData = res;

          // Pie
          const spent = res?.pie?.spent ?? 0;
          const remaining = res?.pie?.remaining ?? 0;

          this.pieData = {
            labels: ['Spent', 'Remaining'],
            datasets: [{ data: [spent, Math.max(remaining, 0)] }],
          };

          // Stacked category data
          const cats = (res?.categoriesStacked ?? []).sort(
            (a: { limit: number; spent: number }, b: { limit: number; spent: number }) =>
              a.limit - a.spent - (b.limit - b.spent),
          ); // lowest remaining first

          const labels = cats.map((c: { name: string }) => c.name);
          const spentArr = cats.map((c: { spent: number }) => c.spent);
          const remainingArr = cats.map((c: { limit: number; spent: number }) =>
            Math.max(c.limit - c.spent, 0),
          );
          const overArr = cats.map((c: { spent: number; limit: number }) =>
            Math.max(c.spent - c.limit, 0),
          );

          const includeOver = false;

          this.stackedData = {
            labels,
            datasets: includeOver
              ? [
                  { label: 'Spent', data: spentArr },
                  { label: 'Remaining', data: remainingArr },
                  { label: 'Over', data: overArr },
                ]
              : [
                  { label: 'Spent', data: spentArr },
                  { label: 'Remaining', data: remainingArr },
                ],
          };

          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }
}
