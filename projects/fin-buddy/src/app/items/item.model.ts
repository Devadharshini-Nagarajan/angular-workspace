export interface Item {
  id: string;
  categoryId: string;

  occurredAt: string; // ISO date string
  merchant?: string;
  name: string;
  note?: string;

  amount: number;
}
