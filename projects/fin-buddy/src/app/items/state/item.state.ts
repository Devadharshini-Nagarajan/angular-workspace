import { Item } from '../item.model';

export interface ItemsState {
  items: Item[];
  monthKey: string | null;
  loading: boolean;
  error: string | null;
}

export const initialItemsState: ItemsState = {
  monthKey: null,
  items: [],
  loading: false,
  error: null,
};
