import fs from 'fs';
import path from 'path';

export type OrderStatus = 'ახალი' | 'მზადდება' | 'კურიერთანაა' | 'ჩაბარდა';

export interface OrderItemRecord {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  colorName?: string;
  image: string; // Product image or custom design composite DataURL
  isCustomStudio?: boolean;
  customDetails?: {
    garmentType: string;
    garmentColor: string;
    textPrint?: string;
    textFont?: string;
    printStyle?: string;
  };
}

export interface OrderRecord {
  id: string; // e.g. "LMZ-78219"
  createdAt: string; // ISO date
  customerName: string;
  phoneNumber: string;
  districtId: string;
  districtName: string;
  streetAddress: string;
  apartment?: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItemRecord[];
  productSummary: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data folder and seed file exist
function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    const initialSeed: OrderRecord[] = [];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
}

export function getAllOrders(): OrderRecord[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read orders:', error);
    return [];
  }
}

export function saveOrder(order: Omit<OrderRecord, 'id' | 'createdAt' | 'status'> & { id?: string }): OrderRecord {
  ensureDataFile();
  const orders = getAllOrders();

  const generatedCode = order.id || `LMZ-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: OrderRecord = {
    ...order,
    id: generatedCode,
    createdAt: new Date().toISOString(),
    status: 'ახალი',
  };

  orders.unshift(newOrder); // newest first
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): OrderRecord | null {
  ensureDataFile();
  const orders = getAllOrders();
  const index = orders.findIndex((o) => o.id === orderId);

  if (index === -1) return null;

  orders[index].status = status;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');

  return orders[index];
}
