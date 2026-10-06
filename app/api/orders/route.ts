import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, saveOrder, updateOrderStatus, OrderStatus } from '@/lib/orders';

// GET /api/orders — Fetch list of orders
export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders — Save new customer order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.phoneNumber || !body.streetAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer details' },
        { status: 400 }
      );
    }

    const saved = saveOrder({
      customerName: body.customerName,
      phoneNumber: body.phoneNumber,
      districtId: body.districtId || 'batumi-center',
      districtName: body.districtName || 'ბათუმი',
      streetAddress: body.streetAddress,
      apartment: body.apartment || '',
      paymentMethod: body.paymentMethod || 'cash',
      subtotal: body.subtotal || 0,
      deliveryFee: body.deliveryFee || 0,
      totalAmount: body.totalAmount || body.subtotal || 0,
      items: body.items || [],
      productSummary: body.productSummary || 'Streetwear Order',
    });

    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders — Update order status (Admin)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'orderId and status are required' },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(orderId, status as OrderStatus);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
