"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showReferEarn, setShowReferEarn] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [addingFunds, setAddingFunds] = useState(false);

  async function loadWallet() {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to load wallet:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "credits") return tx.amount > 0;
    if (filter === "debits") return tx.amount < 0;
    return true;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText("BULKREF500");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      alert("Please enter a valid amount to load");
      return;
    }
    setAddingFunds(true);
    try {
      // 1. Create Razorpay order on our backend
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(addAmount) })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create payment order");
      }
      
      const orderData = await res.json();
      
      // Define Razorpay options and verify callback handler
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BulkBlitz Wallet Load",
        description: `Load ₹${addAmount} into BulkCash`,
        order_id: orderData.mock ? null : orderData.id,
        handler: async function (response) {
          setAddingFunds(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || "",
                amount: parseFloat(addAmount),
                mock: orderData.mock
              })
            });
            
            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              setBalance(verifyData.balance);
              // reload transaction history and wallet
              await loadWallet();
              setShowAddMoney(false);
              setAddAmount("");
              alert(`₹${addAmount} loaded successfully via Razorpay!`);
            } else {
              const err = await verifyRes.json();
              alert(err.error || "Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment");
          } finally {
            setAddingFunds(false);
          }
        },
        prefill: {
          name: "Ashish Sharma",
          email: "ashish@bulkblitz.in",
          contact: "+919999999999"
        },
        theme: {
          color: "#FF6A00"
        },
        modal: {
          ondismiss: function () {
            setAddingFunds(false);
          }
        }
      };

      // 2. Sandbox simulation check
      if (orderData.mock) {
        const confirmSuccess = window.confirm(
          `[BulkBlitz Sandbox] Simulating Razorpay checkout popup for ₹${addAmount}.\n\nClick OK to simulate a successful payment callback.\nClick Cancel to simulate modal close.`
        );
        
        if (confirmSuccess) {
          options.handler({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 12)}`,
            razorpay_signature: "mock_signature_abc123"
          });
        } else {
          setAddingFunds(false);
        }
        return;
      }

      // 3. Load Razorpay script and open live checkout modal
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setAddingFunds(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error loading funds:", error);
      alert(error.message || "Failed to load funds due to server error");
      setAddingFunds(false);
    }
  };

  return (
    <>
      <Header />

      <main className="wallet-main">
        <div className="container">
          
          {/* Wallet Header */}
          <div className="wallet-header animate-fade-in">
            <h1 className="wallet-title">BulkCash Wallet</h1>
            <p className="wallet-subtitle">Manage your referral credits, cashbacks, and payment refunds.</p>
          </div>

          {/* Balance Card - Premium Gradient Glassmorphic */}
          <div className="balance-card animate-fade-in-up">
            <div className="balance-card__orb balance-card__orb--1"></div>
            <div className="balance-card__orb balance-card__orb--2"></div>
            <div className="balance-card__content">
              <span className="balance-label">Available Balance</span>
              <h2 className="balance-amount animate-pulse-soft">
                {loading ? "₹..." : formatPrice(balance, false)}
              </h2>
              <span className="balance-currency-label">BulkCash Credits (1 Credit = ₹1)</span>
              
              <div className="balance-actions">
                <button 
                  className="btn btn--primary" 
                  onClick={() => setShowAddMoney(true)}
                  id="add-money-btn"
                >
                  <span className="btn-icon">⚡</span> Add Cash
                </button>
                <button 
                  className="btn btn--secondary btn--glass" 
                  onClick={() => setShowReferEarn(true)}
                  id="refer-earn-btn"
                >
                  <span className="btn-icon">🎁</span> Refer & Earn
                </button>
              </div>
            </div>
          </div>

          {/* How to Earn Section */}
          <section className="earn-section animate-fade-in-up animate-delay-100">
            <h3 className="section-title">How to earn BulkCash</h3>
            <div className="earn-grid">
              <div className="earn-card">
                <div className="earn-card__icon">👥</div>
                <h4>Refer Friends</h4>
                <p>Get ₹100 for every friend who joins their first batch. They get ₹50 off too!</p>
              </div>
              <div className="earn-card">
                <div className="earn-card__icon">📈</div>
                <h4>Complete Batches</h4>
                <p>Unlock milestone bonuses when you help push active batches to the lowest price tier.</p>
              </div>
              <div className="earn-card">
                <div className="earn-card__icon">⭐</div>
                <h4>Review Products</h4>
                <p>Write detailed verified-buyer reviews of products you received to earn ₹20 per review.</p>
              </div>
            </div>
          </section>

          {/* Transaction History Section */}
          <section className="tx-section animate-fade-in-up animate-delay-200">
            <div className="tx-header">
              <h3 className="section-title">Transaction History</h3>
              <div className="filter-tabs">
                {["all", "credits", "debits"].map((tab) => (
                  <button
                    key={tab}
                    className={`filter-tab ${filter === tab ? "filter-tab--active" : ""}`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="tx-list">
              {filteredTransactions.length === 0 ? (
                <div className="empty-tx">
                  <p>No transactions found for this filter.</p>
                </div>
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const isCredit = tx.amount > 0;
                  return (
                    <div key={tx.id || idx} className="tx-row">
                      <div className="tx-row__left">
                        <div className={`tx-icon ${isCredit ? "tx-icon--credit" : "tx-icon--debit"}`}>
                          {isCredit ? "↑" : "↓"}
                        </div>
                        <div>
                          <p className="tx-desc">{tx.description}</p>
                          <span className="tx-date">{formatDate(tx.date)}</span>
                        </div>
                      </div>
                      <div className={`tx-amount ${isCredit ? "tx-amount--credit" : "tx-amount--debit"}`}>
                        {isCredit ? "+" : ""}{formatPrice(tx.amount, false)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowAddMoney(false)}>
          <div className="modal-content animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddMoney(false)}>×</button>
            <h3>Add BulkCash</h3>
            <p>Load money into your BulkCash wallet using UPI or Card for super-fast batch joining checkout.</p>
            
            <div className="input-group">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="modal-input"
              />
            </div>
            
            <div className="modal-quick-amounts">
              {[200, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  className="quick-amount-btn"
                  onClick={() => setAddAmount(amt.toString())}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <button 
              className="btn btn--primary w-full"
              onClick={handleAddFunds}
              disabled={addingFunds}
            >
              {addingFunds ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      )}

      {/* Refer & Earn Modal */}
      {showReferEarn && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowReferEarn(false)}>
          <div className="modal-content animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReferEarn(false)}>×</button>
            <h3>Refer & Earn</h3>
            <p>Invite your network to join batches on BulkBlitz and save together.</p>
            
            <div className="referral-box">
              <span className="referral-label">Your Referral Code</span>
              <div className="referral-input-wrapper">
                <code className="referral-code">BULKREF500</code>
                <button className="copy-btn" onClick={handleCopyCode}>
                  {isCopied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>

            <div className="social-shares">
              <button 
                className="btn btn--success w-full"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=Hey! Join BulkBlitz using my referral code BULKREF500 to get ₹50 free credits instantly, and save up to 40% on bulk products! Join now: https://bulkblitz.in`, '_blank');
                }}
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .wallet-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: #050505;
        }

        .wallet-header {
          margin-bottom: var(--space-8);
        }

        .wallet-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
        }

        .wallet-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1.05rem;
        }

        /* Balance Card Styling */
        .balance-card {
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(12, 12, 12, 0.88) 100%);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
          color: white;
          border: 1px solid rgba(255, 107, 0, 0.28);
          box-shadow: 0 8px 32px rgba(255, 107, 0, 0.14), var(--shadow-premium);
          margin-bottom: var(--space-10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .balance-card__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.25;
        }

        .balance-card__orb--1 {
          width: 200px;
          height: 200px;
          background: var(--accent-primary);
          top: -50px;
          right: -50px;
        }

        .balance-card__orb--2 {
          width: 150px;
          height: 150px;
          background: #FF9A3C;
          bottom: -50px;
          left: 10%;
        }

        .balance-card__content {
          position: relative;
          z-index: 1;
        }

        .balance-label {
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.8;
          display: block;
          margin-bottom: var(--space-2);
          color: var(--accent-primary);
        }

        .balance-amount {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin: 0 0 var(--space-1);
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .balance-currency-label {
          font-size: 0.85rem;
          opacity: 0.7;
          display: block;
          margin-bottom: var(--space-6);
        }

        .balance-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .btn--glass {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
        }

        .btn--glass:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .btn-icon {
          margin-right: var(--space-2);
        }

        /* Earn section styling */
        .section-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-5);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::before {
          content: '';
          display: block;
          width: 3px;
          height: 16px;
          background: var(--accent-primary);
          border-radius: 2px;
        }

        .earn-section {
          margin-bottom: var(--space-10);
        }

        .earn-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }

        @media (min-width: 768px) {
          .earn-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .earn-card {
          background: rgba(12, 12, 12, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all var(--transition-base);
        }

        .earn-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .earn-card__icon {
          font-size: 2.2rem;
          margin-bottom: var(--space-3);
        }

        .earn-card h4 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
        }

        .earn-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        /* Transactions Section Styling */
        .tx-section {
          background: rgba(12, 12, 12, 0.82);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .tx-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .tx-header .section-title {
          margin: 0;
        }

        .filter-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .filter-tab {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-tab:hover:not(.filter-tab--active) {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .filter-tab--active {
          background: rgba(255, 107, 0, 0.15);
          color: var(--accent-primary);
          box-shadow: inset 0 0 0 1px rgba(255, 107, 0, 0.25);
        }

        .tx-list {
          display: flex;
          flex-direction: column;
        }

        .tx-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background var(--transition-fast);
        }

        .tx-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .tx-row:first-child {
          padding-top: 0;
        }

        .tx-row:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .tx-row__left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .tx-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .tx-icon--credit {
          background: rgba(34, 197, 94, 0.12);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .tx-icon--debit {
          background: rgba(255, 107, 0, 0.12);
          color: var(--accent-primary);
          border: 1px solid rgba(255, 107, 0, 0.25);
        }

        .tx-desc {
          margin: 0 0 2px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tx-date {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .tx-amount {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .tx-amount--credit {
          color: #22C55E;
        }

        .tx-amount--debit {
          color: var(--text-primary);
        }

        .empty-tx {
          text-align: center;
          color: var(--text-secondary);
          padding: var(--space-10) 0;
        }

        /* Modal Overlay & Styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .modal-content {
          background: rgba(12, 12, 12, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          width: 90%;
          max-width: 450px;
          padding: var(--space-8);
          position: relative;
          box-shadow: var(--shadow-premium);
        }

        .modal-close {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          border: none;
          background: transparent;
          font-size: 1.8rem;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .modal-content h3 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 var(--space-2);
          color: var(--text-primary);
        }

        .modal-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0 0 var(--space-6);
          line-height: 1.5;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .input-prefix {
          position: absolute;
          left: var(--space-4);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .modal-input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) var(--space-8);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 1.5rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .modal-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.12);
        }

        .modal-quick-amounts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .quick-amount-btn {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-sm);
          padding: 6px 0;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .quick-amount-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: rgba(255, 107, 0, 0.06);
        }

        /* Referral Modal Styling */
        .referral-box {
          background: rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          margin-bottom: var(--space-6);
        }

        .referral-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          display: block;
          margin-bottom: var(--space-2);
        }

        .referral-input-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .referral-code {
          font-family: monospace;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .copy-btn {
          border: none;
          background: rgba(255, 107, 0, 0.15);
          color: var(--accent-primary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .copy-btn:hover {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 0 12px rgba(255, 107, 0, 0.3);
        }
      `}</style>
    </>
  );
}
