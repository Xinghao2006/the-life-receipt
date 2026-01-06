export interface ReceiptItem {
  name: string;
  qty: number;
  price: string;
}

export interface ReceiptData {
  dateRange: string;
  cashier: string;
  items: ReceiptItem[];
  totalLabel: string;
  totalValue: string;
  taxLabel: string;
  taxValue: string;
  // Configuration for the hidden polaroid
  hiddenStory?: string;
  hiddenImage?: string;
}

export interface PolaroidData {
  imageUrl: string;
  date: string;
  story: string;
  rotation: number;
}
