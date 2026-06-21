"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Wallet, PlusCircle, Gift, ArrowUpRight, ArrowDownRight, Sparkles, Share2, Users, TrendingUp, Copy, X, Check, Loader2
} from "lucide-react";

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

      // 3. Live Razorpay checkout script loader
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

      <main className="pt-28 pb-20 min-h-[calc(100vh-150px)] bg-[#050505] text-left">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Wallet Header */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-2">
              <Wallet className="w-8 h-8 text-primary" />
              <span>BulkCash Wallet</span>
            </h1>
            <p className="text-sm text-neutral-400">
              Manage your referral credits, cashbacks, and payment refunds.
            </p>
          </div>

          {/* Balance Card - Premium Gradient Glassmorphic */}
          <div className="relative overflow-hidden p-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-neutral-950/90 shadow-2xl shadow-primary/5 mb-10">
            {/* Blur Decorative Orbs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent-2/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Available Balance</span>
                <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                  {loading ? (
                    <span className="inline-block w-32 h-10 bg-white/10 rounded animate-pulse"></span>
                  ) : (
                    formatPrice(balance, false)
                  )}
                </h2>
                <span className="text-xs text-neutral-400 block pt-1">
                  BulkCash Credits (1 Credit = ₹1)
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-accent text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
                  onClick={() => setShowAddMoney(true)}
                  id="add-money-btn"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Cash</span>
                </button>
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-bold transition-all bg-white/2 cursor-pointer"
                  onClick={() => setShowReferEarn(true)}
                  id="refer-earn-btn"
                >
                  <Gift className="w-4 h-4 text-primary" />
                  <span>Refer & Earn</span>
                </button>
              </div>
            </div>
          </div>

          {/* How to Earn Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              <h3 className="text-lg font-display font-bold text-white">How to earn BulkCash</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-white/12 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Refer Friends</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Get ₹100 for every friend who joins their first batch. They get ₹50 off too!
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-white/12 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Complete Batches</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Unlock milestone bonuses when you help push active batches to the lowest price tier.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-white/12 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Review Products</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Write detailed verified-buyer reviews of products you received to earn ₹20 per review.
                </p>
              </div>
            </div>
          </section>

          {/* Transaction History Section */}
          <section className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                <h3 className="text-lg font-display font-bold text-white">Transaction History</h3>
              </div>

              <div className="flex p-0.5 rounded-lg bg-neutral-950 border border-white/5">
                {["all", "credits", "debits"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer capitalize ${
                      filter === tab
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              {filteredTransactions.length === 0 ? (
                <div className="text-center text-neutral-500 py-10 text-xs">
                  <p>No transactions found for this filter.</p>
                </div>
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const isCredit = tx.amount > 0;
                  return (
                    <div 
                      key={tx.id || idx} 
                      className="flex justify-between items-center py-4 border-b border-white/5 last:border-none hover:bg-white/1 transition-colors px-4 -mx-4 rounded-xl"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                          isCredit 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}>
                          {isCredit ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md md:max-w-xl">
                            {tx.description}
                          </p>
                          <span className="text-[10px] text-neutral-500 mt-1 block">
                            {formatDate(tx.date)}
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm font-bold shrink-0 pl-3 ${
                        isCredit ? "text-green-400" : "text-neutral-200"
                      }`}>
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
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" 
          onClick={() => setShowAddMoney(false)}
        >
          <div 
            className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl relative animate-scale-up text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl cursor-pointer" 
              onClick={() => setShowAddMoney(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-display font-black text-white mb-2">Add BulkCash</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Load money into your BulkCash wallet using UPI or Card for super-fast batch joining checkout.
            </p>
            
            <div className="relative flex items-center mb-4">
              <span className="absolute left-4 text-xl font-bold text-neutral-400">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-white/10 focus:border-primary bg-white/5 font-mono text-xl font-bold text-white outline-none transition-all focus:shadow-[0_0_0_3px_rgba(255,106,0,0.15)]"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[200, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  className="py-1.5 text-xs font-bold text-neutral-300 hover:text-primary rounded-lg border border-white/5 hover:border-primary bg-white/2 hover:bg-primary/5 transition-all cursor-pointer"
                  onClick={() => setAddAmount(amt.toString())}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <button 
              className="w-full py-3 rounded-xl bg-primary hover:bg-accent disabled:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
              onClick={handleAddFunds}
              disabled={addingFunds}
            >
              {addingFunds ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Payment...</span>
                </span>
              ) : (
                "Proceed to Pay"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Refer & Earn Modal */}
      {showReferEarn && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" 
          onClick={() => setShowReferEarn(false)}
        >
          <div 
            className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl relative animate-scale-up text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl cursor-pointer" 
              onClick={() => setShowReferEarn(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-display font-black text-white mb-2">Refer & Earn</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Invite your network to join batches on BulkBlitz and save together.
            </p>
            
            <div className="p-4 rounded-xl bg-white/2 border border-white/5 border-dashed mb-6">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Your Referral Code</span>
              <div className="flex items-center justify-between gap-4">
                <code className="font-mono text-xl font-extrabold text-primary">BULKREF500</code>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCopied 
                      ? "bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.2)]" 
                      : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                  }`} 
                  onClick={handleCopyCode}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="social-shares">
              <button 
                className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold shadow-lg shadow-green-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=Hey! Join BulkBlitz using my referral code BULKREF500 to get ₹50 free credits instantly, and save up to 40% on bulk products! Join now: https://bulkblitz.in`, '_blank');
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
