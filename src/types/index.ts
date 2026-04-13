export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
}

export type Category =
  | 'pinse-bianche'
  | 'pinse-rosse'
  | 'pinse-fredde'
  | 'taglieri'
  | 'fritti'
  | 'bevande'
  | 'birre';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  tableNumber?: string;
  customerName?: string;
  status: 'pending' | 'completed';
}

export interface Receipt {
  type: 'kitchen' | 'customer';
  order: Order;
  items: OrderItem[];
}
