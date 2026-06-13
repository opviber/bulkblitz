"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";

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
        return "var(--accent-success)";
      case "SHIPPED":
        return "var(--accent-warning)";
      case "CONFIRMED":
      default:
        return "var(--accent-primary)";
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

      <main className="orders-main">
        <div className="container">
          {/* Page Header */}
          <div className="orders-header animate-fade-in">
            <div>
              <h1 className="orders-title">
                My Orders
                {!loading && <span className="orders-count-badge">{orders.length}</span>}
              </h1>
              <p className="orders-subtitle">
                Track your active crowd-buys and order history.
              </p>
            </div>
            <Link href="/" className="btn btn--secondary btn--sm">
              Browse More Batches
            </Link>
          </div>

          {loading ? (
            <div className="orders-list">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: "200px", borderRadius: "var(--radius-lg)", marginBottom: "var(--space-4)" }}></div>
              ))}
            </div>
          ) : orders.length === 0 ? (

            <div className="empty-state animate-fade-in-up">
              <div className="empty-state__icon">📦</div>
              <h3>No orders yet</h3>
              <p>Join active batches to unlock massive manufacturer discounts together!</p>
              <Link href="/" className="btn btn--primary">
                Explore Batches
              </Link>
            </div>
          ) : (
            <div className="orders-layout">
              {/* Orders List */}
              <div className="orders-list stagger-children">
                {orders.map((order, index) => {
                  const isActive = selectedOrder?.id === order.id;
                  const stepIndex = getStepIndex(order.status);
                  
                  return (
                    <div
                      key={order.id}
                      className={`order-card animate-fade-in-up ${isActive ? "order-card--active" : ""}`}
                      onClick={() => setSelectedOrder(isActive ? null : order)}
                    >
                      <div className="order-card__header">
                        <div>
                          <span className="order-card__id">Order #{order.id}</span>
                          <span className="order-card__date">
                            Ordered on {formatDate(order.orderedAt)}
                          </span>
                        </div>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            borderColor: `${getStatusColor(order.status)}30`,
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="order-card__body">
                        <div className="order-card__details">
                          <h3 className="order-card__title">{order.batchTitle}</h3>
                          <span className="order-card__manufacturer">
                            by {order.manufacturer.name}
                          </span>
                          
                          <div className="order-card__meta">
                            <div className="meta-item">
                              <span className="meta-label">Quantity</span>
                              <span className="meta-value">{order.quantity} units</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Price per unit</span>
                              <span className="meta-value">{formatPrice(order.pricePerUnit, false)}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Total Amount</span>
                              <span className="meta-value price-total">
                                {formatPrice(order.totalAmount, false)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stepper Timeline */}
                      <div className="stepper">
                        <div className="stepper__line">
                          <div
                            className="stepper__line-fill"
                            style={{
                              width: `${((stepIndex - 1) / 3) * 100}%`,
                            }}
                          ></div>
                        </div>
                        {[
                          { label: "Ordered", desc: "Hold authorized" },
                          { label: "Confirmed", desc: "Batch successful" },
                          { label: "Shipped", desc: "In transit" },
                          { label: "Delivered", desc: "Received" },
                        ].map((step, sIdx) => {
                          const isCompleted = stepIndex > sIdx;
                          const isCurrent = stepIndex === sIdx + 1;
                          return (
                            <div
                              key={step.label}
                              className={`stepper__step ${isCompleted ? "stepper__step--completed" : ""} ${isCurrent ? "stepper__step--current" : ""}`}
                            >
                              <div className="stepper__dot">
                                {isCompleted ? (
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9 1L3.5 6.5L1 4"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <span className="stepper__dot-inner"></span>
                                )}
                              </div>
                              <div className="stepper__text">
                                <span className="stepper__label">{step.label}</span>
                                <span className="stepper__desc">{step.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Section */}
                      {isActive && (
                        <div className="order-card__expanded animate-slide-down" onClick={(e) => e.stopPropagation()}>
                          <hr className="divider" />
                          <div className="expanded-grid">
                            <div>
                              <h4>Shipping Details</h4>
                              <p className="expanded-text">
                                <strong>Manufacturer:</strong> {order.manufacturer.name}<br />
                                <strong>Origin:</strong> {order.manufacturer.city}, {order.manufacturer.state}
                              </p>
                              {order.trackingNumber && (
                                <p className="tracking-info">
                                  <strong>Tracking Number:</strong>{" "}
                                  <span className="tracking-link">{order.trackingNumber}</span>
                                </p>
                              )}
                            </div>
                            <div className="expanded-actions">
                              <Link href={`/batch/${order.batchId}`} className="btn btn--secondary btn--sm w-full text-center">
                                View Original Batch
                              </Link>
                              <button className="btn btn--ghost btn--sm w-full">
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
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .orders-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: var(--bg-primary);
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-8);
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .orders-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .orders-count-badge {
          font-size: 1rem;
          font-weight: 700;
          background: var(--accent-primary-light);
          color: var(--accent-primary);
          padding: 2px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--accent-primary);
        }

        .orders-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        .orders-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .order-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-default);
        }

        .order-card--active {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--accent-primary);
        }

        .order-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .order-card__id {
          font-weight: 700;
          color: var(--text-primary);
          margin-right: var(--space-3);
          font-size: 1.05rem;
        }

        .order-card__date {
          color: var(--text-tertiary);
          font-size: 0.85rem;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          border: 1px solid;
          letter-spacing: 0.05em;
        }

        .order-card__title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px;
        }

        .order-card__manufacturer {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: var(--space-4);
        }

        .order-card__meta {
          display: flex;
          gap: var(--space-8);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .price-total {
          color: var(--accent-success);
          font-weight: 700;
        }

        /* Stepper CSS */
        .stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          margin-top: var(--space-6);
          padding-top: var(--space-4);
        }

        .stepper__line {
          position: absolute;
          top: 24px;
          left: 12.5%;
          right: 12.5%;
          height: 3px;
          background-color: var(--border-default);
          z-index: 1;
        }

        .stepper__line-fill {
          height: 100%;
          background-color: var(--accent-success);
          transition: width var(--transition-slow) cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stepper__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .stepper__dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg-surface);
          border: 3px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
          margin-bottom: var(--space-2);
        }

        .stepper__dot-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: transparent;
          transition: all var(--transition-base);
        }

        .stepper__label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color var(--transition-base);
        }

        .stepper__desc {
          display: block;
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        /* Completed Step */
        .stepper__step--completed .stepper__dot {
          background-color: var(--accent-success);
          border-color: var(--accent-success);
        }

        .stepper__step--completed .stepper__label {
          color: var(--text-primary);
        }

        /* Current Step */
        .stepper__step--current .stepper__dot {
          border-color: var(--accent-success);
          background-color: var(--bg-surface);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .stepper__step--current .stepper__dot-inner {
          background-color: var(--accent-success);
        }

        .stepper__step--current .stepper__label {
          color: var(--accent-success);
          font-weight: 700;
        }

        /* Expanded Details styling */
        .order-card__expanded {
          margin-top: var(--space-4);
        }

        .divider {
          border: none;
          border-top: 1px solid var(--border-light);
          margin: var(--space-4) 0;
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 640px) {
          .expanded-grid {
            grid-template-columns: 2fr 1fr;
            align-items: center;
          }
        }

        .expanded-grid h4 {
          margin: 0 0 var(--space-2);
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .expanded-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .tracking-info {
          font-size: 0.85rem;
          margin: var(--space-2) 0 0 0;
          color: var(--text-secondary);
        }

        .tracking-link {
          color: var(--accent-primary);
          text-decoration: underline;
          cursor: pointer;
        }

        .expanded-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: var(--space-16) var(--space-6);
          background: var(--bg-surface);
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-default);
          max-width: 500px;
          margin: var(--space-8) auto;
        }

        .empty-state__icon {
          font-size: 4rem;
          margin-bottom: var(--space-4);
        }

        .empty-state h3 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 var(--space-2);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 var(--space-6);
          font-size: 0.95rem;
        }

        @media (max-width: 576px) {
          .stepper__desc {
            display: none;
          }
          .stepper__label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
