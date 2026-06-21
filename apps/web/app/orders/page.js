"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Package, Calendar, Check, ExternalLink, MapPin, Building2, ChevronDown, ChevronUp, Loader2
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "#1DB954"; // Green (success)
      case "SHIPPED":
        return "#F59E0B"; // Amber (warning)
      case "CONFIRMED":
      default:
        return "#FF6B00"; // Primary orange
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case "DELIVERED":
        return 4;
      case "SHIPPED":
        return 3;
      case "CONFIRMED":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <>
      <Header />

      <main className="pt-28 pb-20 min-h-[calc(100vh-150px)] bg-[#050505] text-left">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
                My Orders
                {!loading && (
                  <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-neutral-400 mt-2">
                Track your active crowd-buys and order history.
              </p>
            </div>
            <Link 
              href="/" 
              className="px-4 py-2 text-xs font-bold rounded-lg border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all bg-white/2 cursor-pointer"
            >
              Browse More Batches
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((n) => (
                <div 
                  key={n} 
                  className="h-48 w-full rounded-2xl bg-neutral-900/40 border border-white/5 animate-pulse"
                ></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center text-center p-12 md:p-16 rounded-2xl border border-white/5 bg-neutral-900/10 backdrop-blur-xl max-w-md mx-auto my-12 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">No orders yet</h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Join active batches to unlock massive manufacturer discounts together!
              </p>
              <Link 
                href="/" 
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Explore Batches
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {orders.map((order) => {
                const isActive = selectedOrder?.id === order.id;
                const stepIndex = getStepIndex(order.status);
                
                return (
                  <div
                    key={order.id}
                    className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "bg-neutral-950 border-primary shadow-lg shadow-primary/5" 
                        : "bg-neutral-900/40 border-white/5 hover:border-white/12 hover:bg-neutral-900/60 shadow-xl"
                    }`}
                    onClick={() => setSelectedOrder(isActive ? null : order)}
                  >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-neutral-400">Order</span>
                          <span className="font-mono text-xs text-primary font-bold bg-primary/5 border border-primary/10 px-2 py-0.5 rounded break-all max-w-[280px] md:max-w-md">
                            #{order.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1">
                          <Calendar className="w-3.5 h-3.5 opacity-60" />
                          <span>Ordered on {formatDate(order.orderedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border uppercase"
                          style={{
                            backgroundColor: `${getStatusColor(order.status)}12`,
                            color: getStatusColor(order.status),
                            borderColor: `${getStatusColor(order.status)}24`,
                          }}
                        >
                          {order.status}
                        </span>
                        {isActive ? (
                          <ChevronUp className="w-4 h-4 text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-500" />
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white hover:text-primary transition-colors duration-200">
                          {order.batchTitle}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                          <span>by {order.manufacturer.name}</span>
                        </div>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quantity</span>
                          <span className="text-sm font-semibold text-neutral-200">{order.quantity} units</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Price per Unit</span>
                          <span className="text-sm font-semibold text-neutral-200">{formatPrice(order.pricePerUnit, false)}</span>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Amount</span>
                          <span className="text-sm font-bold text-green-400">{formatPrice(order.totalAmount, false)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="relative mt-8 pt-4">
                      {/* Progress Line */}
                      <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-neutral-800 -translate-y-1/2 z-0">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                          style={{ width: `${((stepIndex - 1) / 3) * 100}%` }}
                        ></div>
                      </div>

                      {/* Steps Grid */}
                      <div className="relative grid grid-cols-4 z-10">
                        {[
                          { label: "Ordered", desc: "Hold authorized" },
                          { label: "Confirmed", desc: "Batch successful" },
                          { label: "Shipped", desc: "In transit" },
                          { label: "Delivered", desc: "Received" },
                        ].map((step, sIdx) => {
                          const isCompleted = stepIndex > sIdx;
                          const isCurrent = stepIndex === sIdx + 1;
                          
                          return (
                            <div key={step.label} className="flex flex-col items-center text-center group">
                              {/* Circle Container */}
                              <div className="relative flex items-center justify-center h-8">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-primary border-2 border-primary text-white shadow-[0_0_12px_rgba(255,106,0,0.3)]"
                                      : isCurrent
                                      ? "bg-neutral-950 border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(255,106,0,0.15)]"
                                      : "bg-neutral-900 border-2 border-neutral-800 text-neutral-600"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                  ) : isCurrent ? (
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                  )}
                                </div>
                              </div>

                              {/* Labels */}
                              <div className="mt-3 flex flex-col items-center gap-0.5">
                                <span
                                  className={`text-xs font-bold transition-colors duration-200 ${
                                    isCurrent ? "text-primary" : isCompleted ? "text-neutral-200" : "text-neutral-500"
                                  }`}
                                >
                                  {step.label}
                                </span>
                                <span className="hidden sm:block text-[10px] text-neutral-500 font-medium">
                                  {step.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expanded Section */}
                    {isActive && (
                      <div 
                        className="mt-6 pt-6 border-t border-white/5 text-left" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Shipping Details</h4>
                              <div className="space-y-2 text-xs text-neutral-300">
                                <p>
                                  <strong className="text-neutral-400">Manufacturer:</strong> {order.manufacturer.name}
                                </p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>{order.manufacturer.city}, {order.manufacturer.state}</span>
                                </p>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-white/3 border border-white/5 max-w-fit">
                                <span className="text-xs font-medium text-neutral-400">Tracking Number:</span>
                                <span className="font-mono text-xs font-bold text-primary select-all">{order.trackingNumber}</span>
                                <span className="text-[10px] text-neutral-500">(UPS Ground)</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <Link 
                              href={`/batch/${order.batchId}`} 
                              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-bold transition-all bg-white/2 cursor-pointer w-full text-center"
                            >
                              <span>View Original Batch</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button 
                              onClick={() => alert("Connecting to support team...")}
                              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer w-full"
                            >
                              Need Help? Contact Support
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
