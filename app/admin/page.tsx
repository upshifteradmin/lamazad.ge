'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Package,
  Truck,
  ExternalLink,
  MessageCircle,
  Eye,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/lib/orders';
import { formatGEL } from '@/lib/utils';

const ADMIN_PASSCODE = 'batumi2026';

const STATUS_OPTIONS: OrderStatus[] = ['ახალი', 'მზადდება', 'კურიერთანაა', 'ჩაბარდა'];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  ახალი: { bg: 'bg-brand-coral/15', text: 'text-brand-coral', border: 'border-brand-coral/40' },
  მზადდება: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40' },
  კურიერთანაა: { bg: 'bg-brand-cyan/15', text: 'text-brand-cyan', border: 'border-brand-cyan/40' },
  ჩაბარდა: { bg: 'bg-brand-lime/15', text: 'text-brand-lime', border: 'border-brand-lime/40' },
};

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Check stored auth
  useEffect(() => {
    const saved = localStorage.getItem('lmz_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(false);
      localStorage.setItem('lmz_admin_auth', 'true');
    } else {
      setPasscodeError(true);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status', err);
      fetchOrders();
    }
  };

  // WhatsApp admin message trigger
  const generateAdminWhatsAppLink = (order: OrderRecord) => {
    const cleanPhone = order.phoneNumber.replace(/[^0-9]/g, '');
    const message = `გამარჯობა ${order.customerName}! 🇬🇪\nlamazad.ge-ს ადმინისტრაცია გიკავშირდებათ თქვენს შეკვეთაზე (#${order.id}).\n\nსტატუსი: ${order.status}\nპროდუქტი: ${order.productSummary}\nმისამართი: ${order.districtName}, ${order.streetAddress}\n\nკურიერი მალე დაგიკავშირდებათ! ⚡`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phoneNumber.includes(searchQuery) ||
      o.districtName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'ჩაბარდა').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111116] border border-border-subtle rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white">LAMAZAD.GE ADMIN</h1>
          <p className="text-xs text-brand-muted mt-1 mb-6">
            შეიყვანეთ ადმინისტრატორის პაროლი
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="პაროლი (ნაგულისხმევი: batumi2026)"
                value={inputPasscode}
                onChange={(e) => {
                  setInputPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl text-center text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime font-mono"
              />
              {passcodeError && (
                <p className="text-xs text-brand-coral mt-1.5 font-semibold">
                  არასწორი პაროლი! სცადეთ: batumi2026
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-lime text-black font-extrabold text-sm hover:bg-brand-lime/90 transition-all shadow-neon-lime"
            >
              შესვლა
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border-subtle">
            <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              მაღაზიაში დაბრუნება
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-lime text-black font-black flex items-center justify-center text-lg">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  შეკვეთების მართვა
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime border border-brand-lime/30">
                  BATUMI LIVE
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                შემოსული შეკვეთები და პირდაპირი კონტაქტი WhatsApp-ში
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-surface border border-border-subtle text-xs font-semibold hover:border-brand-lime flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-lime' : ''}`} />
              განახლება
            </button>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-surface border border-border-subtle text-xs font-semibold hover:border-white text-gray-300 transition-colors"
            >
              მაღაზია
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('lmz_admin_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-gray-400 hover:text-brand-coral transition-colors"
            >
              გამოსვლა
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-border-subtle">
            <div className="text-xs text-brand-muted">სულ შეკვეთები</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">{orders.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-border-subtle">
            <div className="text-xs text-brand-muted">აქტიური (მუშავდება)</div>
            <div className="text-2xl font-black text-brand-cyan mt-1 font-mono">{activeOrdersCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-border-subtle">
            <div className="text-xs text-brand-muted">ჩაბარებული</div>
            <div className="text-2xl font-black text-brand-lime mt-1 font-mono">
              {orders.filter((o) => o.status === 'ჩაბარდა').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-border-subtle">
            <div className="text-xs text-brand-muted">ჯამური ბრუნვა</div>
            <div className="text-2xl font-black text-brand-lime mt-1 font-mono">{formatGEL(totalRevenue)}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border-subtle">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === s
                    ? 'bg-brand-lime text-black shadow-neon-lime'
                    : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                }`}
              >
                {s === 'all' ? 'ყველა' : s}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ძებნა (კოდი, სახელი, ნომერი)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-card border border-border-subtle rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#15151c] border-b border-border-subtle font-mono uppercase text-brand-muted text-[11px]">
                <tr>
                  <th className="py-3 px-4">შეკვეთის #</th>
                  <th className="py-3 px-4">მომხმარებელი & ტელეფონი</th>
                  <th className="py-3 px-4">უბანი & მისამართი</th>
                  <th className="py-3 px-4">პროდუქტი</th>
                  <th className="py-3 px-4">თანხა</th>
                  <th className="py-3 px-4">სტატუსი</th>
                  <th className="py-3 px-4 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      შეკვეთა არ მოიძებნა
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES['ახალი'];
                    const firstItem = order.items?.[0];

                    return (
                      <tr key={order.id} className="hover:bg-surface-elevated/50 transition-colors">
                        {/* ID & Date */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">#{order.id}</span>
                          <span className="text-[10px] text-brand-muted">
                            {new Date(order.createdAt).toLocaleTimeString('ka-GE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <a
                            href={`tel:${order.phoneNumber}`}
                            className="font-mono text-brand-cyan hover:underline flex items-center gap-1 mt-0.5 text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            {order.phoneNumber}
                          </a>
                        </td>

                        {/* Address */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="font-semibold text-gray-200 truncate">{order.districtName}</div>
                          <div className="text-[11px] text-gray-400 truncate">
                            {order.streetAddress} {order.apartment ? `(${order.apartment})` : ''}
                          </div>
                        </td>

                        {/* Product Thumbnail & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            {firstItem?.image ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-border-subtle shrink-0">
                                <Image src={firstItem.image} alt="item" fill className="object-cover" />
                              </div>
                            ) : null}
                            <div className="max-w-[180px]">
                              <div className="font-semibold text-white truncate text-xs">
                                {order.productSummary}
                              </div>
                              {firstItem?.isCustomStudio && (
                                <span className="text-[9px] font-mono text-brand-lime block">
                                  CUSTOM MERCH
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-lime">
                          {formatGEL(order.totalAmount)}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {order.paymentMethod === 'cash' ? 'ნაღდი' : order.paymentMethod === 'card' ? 'ბარათი' : 'გადარიცხვა'}
                          </span>
                        </td>

                        {/* Status Toggle Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st} className="bg-[#121217] text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions (WhatsApp & Details) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={generateAdminWhatsAppLink(order)}
                              target="_blank"
                              rel="noreferrer"
                              title="გახსენი WhatsApp-ში"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors"
                              title="დეტალები"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#111116] border border-border-subtle rounded-3xl p-6 shadow-2xl relative text-white">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-base font-bold text-brand-lime">#{selectedOrder.id}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${STATUS_STYLES[selectedOrder.status]?.bg} ${STATUS_STYLES[selectedOrder.status]?.text} ${STATUS_STYLES[selectedOrder.status]?.border}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Customer card */}
                <div className="p-3.5 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                  <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
                  <div className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{selectedOrder.phoneNumber}</span>
                  </div>
                  <div className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-lime" />
                    <span>{selectedOrder.districtName}, {selectedOrder.streetAddress} {selectedOrder.apartment ? `(${selectedOrder.apartment})` : ''}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-mono text-brand-muted">შეკვეთილი ნივთები:</div>
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex gap-3 items-center p-3 rounded-xl bg-surface border border-border-subtle">
                      {it.image && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/50 border border-border-subtle shrink-0">
                          <Image src={it.image} alt="item" fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{it.title}</div>
                        <div className="text-gray-400 font-mono text-[11px]">
                          ზომა: {it.size} • რაოდენობა: {it.quantity}
                        </div>
                        {it.customDetails?.textPrint && (
                          <div className="text-brand-cyan font-mono text-[10px]">
                            პრინტი: &quot;{it.customDetails.textPrint}&quot;
                          </div>
                        )}
                        <div className="text-brand-lime font-mono font-bold mt-1">
                          {formatGEL(it.price * it.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-surface-card border border-border-subtle">
                  <span className="font-bold text-white">სულ გადასახდელი:</span>
                  <span className="text-xl font-mono font-black text-brand-lime">
                    {formatGEL(selectedOrder.totalAmount)}
                  </span>
                </div>

                {/* Direct Action */}
                <a
                  href={generateAdminWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-extrabold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  მომხმარებელთან WhatsApp-ში დაკავშირება
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
