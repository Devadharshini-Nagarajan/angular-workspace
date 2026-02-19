import { Category } from '../categories/category.model';

export interface Budget {
  id: string;
  monthKey: string; // 'YYYY-MM'
  income: number;
  targetSavings?: number;
  note?: string;
}

export interface BudgetCategory {
  id: string;
  limit: number;
  categoryId: string;
  category: Category;
}

export interface BudgetWithCategory {
  budget: Budget;
  budgetCategories: BudgetCategory[];
}

export interface createBudgetCategory {
  budgetId: string | undefined;
  categoryIds: string[];
}
