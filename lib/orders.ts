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
    const initialSeed: OrderRecord[] = [
      {
        id: 'LMZ-84192',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
        customerName: 'ლუკა ბერიძე',
        phoneNumber: '+995 595 12 34 56',
        districtId: 'old-batumi',
        districtName: 'ძველი ბათუმი',
        streetAddress: 'მემედ აბაშიძის 28',
        apartment: 'ბინა 4',
        paymentMethod: 'cash',
        subtotal: 185,
        deliveryFee: 0,
        totalAmount: 185,
        status: 'მზადდება',
        productSummary: 'HOODIE "BATUMI NOCTURNE" (L)',
        items: [
          {
            id: 'item-seed-1',
            title: 'HOODIE "BATUMI NOCTURNE" (500 GSM)',
            price: 185,
            quantity: 1,
            size: 'L',
            colorName: 'Washed Black',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
      {
        id: 'LMZ-63028',
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        customerName: 'მარიამ დოლიძე',
        phoneNumber: '+995 577 98 76 54',
        districtId: 'rustaveli',
        districtName: 'რუსთაველის გამზირი',
        streetAddress: 'რუსთაველის 14',
        apartment: 'სართული 2',
        paymentMethod: 'card',
        subtotal: 110,
        deliveryFee: 0,
        totalAmount: 110,
        status: 'ახალი',
        productSummary: 'CUSTOM STUDIO: Oversized T-Shirt "ლამაზად BATUMI"',
        items: [
          {
            id: 'item-seed-2',
            title: 'CUSTOM LAB: Oversized T-Shirt (წინა მხარე)',
            price: 110,
            quantity: 1,
            size: 'M',
            colorName: 'Acid Slate',
            isCustomStudio: true,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
            customDetails: {
              garmentType: 'tee-front',
              garmentColor: 'Acid Slate',
              textPrint: 'ლამაზად BATUMI',
              printStyle: 'puff',
            },
          },
        ],
      },
      {
        id: 'LMZ-51920',
        createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
        customerName: 'გიორგი მაისურაძე',
        phoneNumber: '+995 599 44 55 66',
        districtId: 'khimshiashvili',
        districtName: 'ხიმშიაშვილი / ახალი ბულვარი',
        streetAddress: 'ხიმშიაშვილის 15B',
        apartment: 'ორბი სითი, ბლოკი C',
        paymentMethod: 'cash',
        subtotal: 340,
        deliveryFee: 0,
        totalAmount: 340,
        status: 'კურიერთანაა',
        productSummary: 'KICKZ V1 "BLACK SEA CHRONO" (43)',
        items: [
          {
            id: 'item-seed-3',
            title: 'KICKZ V1 "BLACK SEA CHRONO"',
            price: 340,
            quantity: 1,
            size: '43',
            colorName: 'Phantom Jet',
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
    ];

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
