"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";
import { 
  User, MapPin, Heart, ShoppingBag, Wallet, ShieldAlert,
  Edit2, Trash2, Plus, Check, Star, AlertCircle, CreditCard,
  Bell, Key, Phone, Mail, Calendar, Sparkles, CheckCircle2, Loader2, ArrowUpRight, ChevronRight
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    trustScore: 100,
    joinedAt: "",
  });
  const [extraProfile, setExtraProfile] = useState({
    gender: "Prefer not to say",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [savedBatches, setSavedBatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Address Modals
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(null); // Address object when editing
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    pin: "",
  });

  // Wallet deposit
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  // Simulated Payment Cards
  const [savedCards, setSavedCards] = useState([
    { id: "c1", brand: "Visa", last4: "4242", expiry: "12/28" },
    { id: "c2", brand: "Mastercard", last4: "8891", expiry: "06/29" }
  ]);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", cvc: "" });
  const [showAddCard, setShowAddCard] = useState(false);

  // Security & Preferences
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordStatus, setPasswordStatus] = useState(null); // { success: boolean, msg: string }
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    batchLocks: true,
    productionUpdates: false,
    marketing: true
  });

  // Load Profile from backend
  async function loadProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          trustScore: data.trustScore || 100,
          joinedAt: data.createdAt || "",
        });
        setAddresses(data.addresses || []);

        // Load custom fields from localStorage unique to user email
        if (data.email) {
          const storedExtra = localStorage.getItem(`profile_extra_${data.email}`);
          if (storedExtra) {
            setExtraProfile(JSON.parse(storedExtra));
          }
          const storedNotifs = localStorage.getItem(`notifications_${data.email}`);
          if (storedNotifs) {
            setNotifications(JSON.parse(storedNotifs));
          }
          const storedCards = localStorage.getItem(`payment_cards_${data.email}`);
          if (storedCards) {
            setSavedCards(JSON.parse(storedCards));
          }
        }
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  // Load Dynamic Orders
  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }

  // Load Wallet Ledgers
  async function loadWallet() {
    setLoadingWallet(true);
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch (err) {
      console.error("Failed to load wallet ledger:", err);
    } finally {
      setLoadingWallet(false);
    }
  }

  // Load Watchlist Batches
  async function loadSavedBatches() {
    try {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const data = await res.json();
        setSavedBatches(data.slice(0, 4)); // Get first few batches as simulated watchlist
      }
    } catch (err) {
      console.error("Failed to load watchlist batches:", err);
    }
  }

  useEffect(() => {
    loadProfile();
    loadSavedBatches();
  }, []);

  // Fetch contextual tabs data dynamically
  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    } else if (activeTab === "wallet") {
      loadWallet();
    }
  }, [activeTab]);

  // Save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      if (res.ok) {
        // Save local extra details
        if (profile.email) {
          localStorage.setItem(`profile_extra_${profile.email}`, JSON.stringify(extraProfile));
        }
        setIsEditingProfile(false);
        alert("Personal profile updated successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile details:", err);
      alert("Server error occurred while updating profile");
    }
  };

  // Add shipping address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pin) {
      alert("Please fill all required address fields");
      return;
    }
    try {
      const res = await fetch("/api/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [...prev, data]);
        setShowAddAddress(false);
        setNewAddress({ type: "Home", street: "", city: "", state: "", pin: "" });
        alert("Shipping address added successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add shipping address");
      }
    } catch (err) {
      console.error("Error creating address:", err);
      alert("Server error occurred while creating address");
    }
  };

  // Edit address details (using updated PUT API)
  const handleEditAddressSubmit = async (e) => {
    e.preventDefault();
    if (!showEditAddress.street || !showEditAddress.city || !showEditAddress.state || !showEditAddress.pin) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch("/api/profile/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: showEditAddress.id,
          type: showEditAddress.type,
          street: showEditAddress.street,
          city: showEditAddress.city,
          state: showEditAddress.state,
          pin: showEditAddress.pin,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === updated.id ? updated : addr))
        );
        setShowEditAddress(null);
        alert("Address updated successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save address details");
      }
    } catch (err) {
      console.error("Error editing address:", err);
      alert("Server error occurred while updating address");
    }
  };

  // Toggle default address
  const handleSetDefaultAddress = async (id) => {
    try {
      const res = await fetch("/api/profile/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          }))
        );
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update default address preference");
      }
    } catch (err) {
      console.error("Error toggling default address:", err);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/profile/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        loadProfile(); // refresh state
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  // Wallet sandbox deposit
  const handleDepositMoney = async (e) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid deposit amount");
      return;
    }
    setIsDepositing(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: val }),
      });
      if (res.ok) {
        const data = await res.json();
        setWallet((prev) => ({
          balance: data.balance,
          transactions: [data.transaction, ...prev.transactions],
        }));
        setDepositAmount("");
        setShowDepositModal(false);
        alert(`Successfully deposited ₹${val.toLocaleString("en-IN")} via Sandbox UPI!`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to complete simulated deposit");
      }
    } catch (err) {
      console.error("Error making sandbox deposit:", err);
    } finally {
      setIsDepositing(false);
    }
  };

  // Manage simulated payment cards
  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (newCard.number.length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    const cardObj = {
      id: "card_" + Math.random().toString(36).substring(7),
      brand: newCard.number.startsWith("4") ? "Visa" : newCard.number.startsWith("5") ? "Mastercard" : "Amex",
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry || "12/30"
    };
    const updated = [...savedCards, cardObj];
    setSavedCards(updated);
    if (profile.email) {
      localStorage.setItem(`payment_cards_${profile.email}`, JSON.stringify(updated));
    }
    setNewCard({ number: "", expiry: "", cvc: "" });
    setShowAddCard(false);
    alert("Simulated card profile added successfully!");
  };

  const handleRemoveCard = (cardId) => {
    const updated = savedCards.filter(c => c.id !== cardId);
    setSavedCards(updated);
    if (profile.email) {
      localStorage.setItem(`payment_cards_${profile.email}`, JSON.stringify(updated));
    }
  };

  // Change Password form handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      setPasswordStatus({ success: false, msg: "All fields are required" });
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordStatus({ success: false, msg: "New password must be at least 6 characters long" });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordStatus({ success: false, msg: "Passwords do not match" });
      return;
    }
    setPasswordStatus({ success: true, msg: "Password updated successfully (Simulated sandbox update)!" });
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  // Update notification switch
  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    if (profile.email) {
      localStorage.setItem(`notifications_${profile.email}`, JSON.stringify(updated));
    }
  };

  const menuItems = [
    { id: "info", label: "Personal Details", icon: User },
    { id: "orders", label: "My Orders & Reservations", icon: ShoppingBag },
    { id: "addresses", label: "Address Book", icon: MapPin },
    { id: "wallet", label: "Wallet & Payments", icon: Wallet },
    { id: "security", label: "Security & Alerts", icon: ShieldAlert },
    { id: "saved", label: "Watchlist / Saved", icon: Heart },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#080808] pt-24 pb-16 px-4">
        {/* Grain overlay for premium look */}
        <div className="noise-overlay" aria-hidden="true" />

        <div className="container mx-auto max-w-6xl">
          {/* Bento Header/Banner */}
          {!loading && (
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/30 p-6 md:p-8 mb-8 backdrop-blur-xl shadow-2xl animate-fade-in">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#FF8C24]/10 blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {/* Large avatar with letter logo */}
                  <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-primary to-[#FF8C24] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/25 border-2 border-white/10">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <h1 className="text-xl md:text-2xl font-display font-black text-white tracking-tight">{profile.name}</h1>
                    <span className="text-xs text-neutral-400 mt-1">Member since {profile.joinedAt ? formatDate(profile.joinedAt) : "..."}</span>
                  </div>
                </div>

                {/* Circular Trust Score dashboard */}
                <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path 
                        className="text-white/5" 
                        strokeWidth="3.5" 
                        stroke="currentColor" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                      <path 
                        className="text-green-500" 
                        strokeWidth="3.5" 
                        strokeDasharray={`${profile.trustScore}, 100`} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                    </svg>
                    <span className="absolute text-xs font-display font-bold text-white">{profile.trustScore}</span>
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-white">Trust Score</span>
                    <span className="text-[10px] text-green-400 font-bold tracking-wide uppercase mt-1">Excellent Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Left Sidebar Navigation (Bento Column) */}
              <div className="lg:col-span-4 flex flex-col gap-1.5 p-3 rounded-2xl border border-white/5 bg-neutral-900/10 backdrop-blur-xl">
                <div className="px-4 py-2.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-left">
                  Account Dashboard
                </div>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${isActive ? "bg-primary/10 text-primary border-primary/20 shadow-md shadow-primary/5" : "text-neutral-400 hover:text-white hover:bg-white/5 border-transparent"}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-primary" : "text-neutral-500"}`} />
                      <span>{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Panel Right Column */}
              <div className="lg:col-span-8 p-6 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-xl shadow-2xl text-left">
                
                {/* 1. PERSONAL DETAILS PANEL */}
                {activeTab === "info" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          <span>Personal Details</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Manage your profile identities and personal metadata.</p>
                      </div>
                      {!isEditingProfile && (
                        <button 
                          onClick={() => setIsEditingProfile(true)}
                          className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
                          <input 
                            type="text"
                            required
                            disabled={!isEditingProfile}
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                          <input 
                            type="email"
                            required
                            disabled={!isEditingProfile}
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                          <div className="relative flex items-center">
                            <input 
                              type="text"
                              disabled
                              value={profile.phone}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/40 border border-white/5 text-neutral-500 text-xs cursor-not-allowed"
                            />
                            <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-4" />
                          </div>
                          <span className="text-[10px] text-neutral-500">Phone number cannot be changed (OTP verified)</span>
                        </div>

                        {/* Creative ecommerce fields: Gender & DOB */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gender</label>
                          <select
                            disabled={!isEditingProfile}
                            value={extraProfile.gender}
                            onChange={(e) => setExtraProfile({ ...extraProfile, gender: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date of Birth</label>
                          <input 
                            type="date"
                            disabled={!isEditingProfile}
                            value={extraProfile.dob}
                            onChange={(e) => setExtraProfile({ ...extraProfile, dob: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {isEditingProfile && (
                        <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                          <button 
                            type="submit"
                            className="px-5 py-2.5 rounded-xl btn-primary-new text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
                          >
                            Save Changes
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              loadProfile();
                              setIsEditingProfile(false);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* 2. ORDER HISTORY PANEL */}
                {activeTab === "orders" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <span>My Orders & Reservations</span>
                      </h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Track your active slots reservations and factory orders.</p>
                    </div>

                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          return (
                            <div key={order.id} className="p-5 rounded-xl border border-white/5 bg-neutral-950/40 hover:border-white/10 transition-all flex flex-col gap-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap border-b border-white/5 pb-3">
                                <div>
                                  <h4 className="font-display font-bold text-sm text-white">{order.batchTitle}</h4>
                                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                                    <span>ID: {order.id.slice(0, 8).toUpperCase()}</span>
                                    <span>•</span>
                                    <span>Placed: {formatDate(order.orderedAt)}</span>
                                  </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${order.status === "DELIVERED" ? "bg-green-500/10 text-green-400 border border-green-500/20" : order.status === "SHIPPED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Reserved Slots</span>
                                  <span className="text-xs font-semibold text-white mt-1">{order.quantity} units</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Per Unit Price</span>
                                  <span className="text-xs font-semibold text-white mt-1">₹{order.pricePerUnit.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Escrow Hold</span>
                                  <span className="text-xs font-bold text-primary mt-1">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Tracking ID</span>
                                  <span className="text-xs font-semibold text-white mt-1 tracking-wider">{order.trackingNumber || "Assigning..."}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4 mt-1 pt-3 border-t border-white/5">
                                <span className="text-[10px] text-neutral-500">
                                  Manufacturer: <strong>{order.manufacturer.name}</strong> ({order.manufacturer.city}, {order.manufacturer.state})
                                </span>
                                <Link 
                                  href={`/batch/${order.batchId}`} 
                                  className="text-primary hover:text-white text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                                >
                                  <span>View Batch</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-xl bg-neutral-900/10">
                        <ShoppingBag className="w-8 h-8 text-neutral-500 mx-auto" />
                        <h3 className="text-sm font-bold text-white mt-3 font-display">No reservations placed</h3>
                        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto mt-1">
                          You haven&apos;t joined any manufacturing batches yet. Explore active batches to pool together and unlock factory pricing.
                        </p>
                        <Link 
                          href="/" 
                          className="px-4 py-1.5 rounded-lg btn-primary-new text-xs font-bold mt-4 inline-block shadow-lg shadow-primary/10"
                        >
                          Discover Batches
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SAVED ADDRESSES PANEL */}
                {activeTab === "addresses" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span>Saved Addresses</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Manage billing and delivery address points.</p>
                      </div>
                      <button 
                        onClick={() => setShowAddAddress(true)}
                        className="px-3.5 py-1.5 rounded-lg btn-primary-new text-xs font-bold shadow-lg shadow-primary/10 cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Address</span>
                      </button>
                    </div>

                    {addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div 
                            key={addr.id} 
                            className={`p-5 rounded-xl border transition-all flex flex-col justify-between min-h-[160px] ${addr.isDefault ? "border-green-500/30 bg-green-500/5 hover:border-green-500/40" : "border-white/5 bg-neutral-950/40 hover:border-white/10"}`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-4 mb-3">
                                <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider bg-white/5 border border-white/5 text-neutral-300 uppercase">
                                  {addr.type}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {addr.street}<br />
                                {addr.city}, {addr.state} - <strong className="text-white">{addr.pin}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                              {!addr.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[10px] font-bold text-primary hover:text-white transition-colors cursor-pointer"
                                >
                                  Set Default
                                </button>
                              )}
                              <button 
                                onClick={() => setShowEditAddress(addr)}
                                className="text-[10px] font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-[10px] font-bold text-danger hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 ml-auto"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-xl bg-neutral-900/10">
                        <MapPin className="w-8 h-8 text-neutral-500 mx-auto" />
                        <h3 className="text-sm font-bold text-white mt-3 font-display">No addresses saved</h3>
                        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto mt-1">
                          You haven&apos;t added any shipping locations yet. Please add a shipping address to receive factory orders.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. WALLET & PAYMENTS PANEL */}
                {activeTab === "wallet" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-primary" />
                          <span>Wallet & Payments</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Manage your BulkCash ledger and card authorizations.</p>
                      </div>
                      <button 
                        onClick={() => setShowDepositModal(true)}
                        className="px-3.5 py-1.5 rounded-lg btn-primary-new text-xs font-bold shadow-lg shadow-primary/10 cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Load Money</span>
                      </button>
                    </div>

                    {loadingWallet ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Balance Card block */}
                        <div className="p-6 rounded-2xl bg-gradient-to-tr from-primary/20 via-neutral-900/80 to-neutral-900/80 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                          <div className="text-left">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Available BulkCash Balance</span>
                            <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1.5">
                              ₹{wallet.balance.toLocaleString("en-IN")}
                            </h3>
                            <p className="text-[10px] text-neutral-500 mt-1">Directly debited for batch escrow slots during reservation holds.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-400">Escrow Secure Wallet</span>
                          </div>
                        </div>

                        {/* Payment Cards Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Simulated Payment Profiles</h3>
                            {!showAddCard && (
                              <button 
                                onClick={() => setShowAddCard(true)}
                                className="text-[10px] font-bold text-primary hover:text-white transition-colors cursor-pointer"
                              >
                                + Add Card
                              </button>
                            )}
                          </div>

                          {showAddCard && (
                            <form onSubmit={handleAddCardSubmit} className="p-4 rounded-xl border border-white/5 bg-neutral-950/40 mb-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Card Number</label>
                                  <input 
                                    type="text" 
                                    maxLength={16}
                                    placeholder="4000 1234 5678 9010"
                                    value={newCard.number}
                                    onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, "") })}
                                    required
                                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Expiry (MM/YY)</label>
                                  <input 
                                    type="text" 
                                    maxLength={5}
                                    placeholder="12/30"
                                    value={newCard.expiry}
                                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                    required
                                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">CVC</label>
                                  <input 
                                    type="password" 
                                    maxLength={3}
                                    placeholder="***"
                                    value={newCard.cvc}
                                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, "") })}
                                    required
                                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button type="submit" className="px-3.5 py-1.5 rounded-lg btn-primary-new text-[10px] font-bold cursor-pointer">
                                  Save Card
                                </button>
                                <button type="button" onClick={() => setShowAddCard(false)} className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-[10px] font-bold text-white cursor-pointer">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {savedCards.map(card => (
                              <div key={card.id} className="p-4 rounded-xl border border-white/5 bg-neutral-950/20 flex items-center justify-between hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-7 rounded bg-white/5 border border-white/5 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-neutral-400" />
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-white">{card.brand} •••• {card.last4}</span>
                                    <span className="text-[9px] text-neutral-500">Expires {card.expiry}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveCard(card.id)}
                                  className="p-1.5 hover:bg-neutral-900 rounded text-neutral-500 hover:text-danger transition-colors cursor-pointer"
                                  title="Remove card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Transactions list */}
                        <div>
                          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-4">Transaction Ledgers</h3>
                          {wallet.transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs text-neutral-400">
                                <thead>
                                  <tr className="border-b border-white/5 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                    <th className="py-2.5">Details</th>
                                    <th className="py-2.5">Date</th>
                                    <th className="py-2.5 text-right">Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {wallet.transactions.map((tx) => {
                                    const isCredit = tx.type === "CREDIT";
                                    return (
                                      <tr key={tx.id} className="hover:bg-white/[0.01]">
                                        <td className="py-3 font-semibold text-white">
                                          <div>{tx.description}</div>
                                          <div className="text-[9px] text-neutral-500 font-normal mt-0.5">{tx.id.toUpperCase()}</div>
                                        </td>
                                        <td className="py-3 text-[10px]">{formatDate(tx.date)}</td>
                                        <td className={`py-3 text-right font-display font-bold ${isCredit ? "text-green-400" : "text-danger"}`}>
                                          {isCredit ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="py-6 text-center border border-dashed border-white/5 rounded-xl bg-neutral-900/10 text-neutral-500 text-xs">
                              No transaction history recorded yet.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. SECURITY & ALERTS PANEL */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    {/* Change Password Block */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary" />
                          <span>Security & Password Settings</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Ensure your account safety by changing credentials regularly.</p>
                      </div>

                      {passwordStatus && (
                        <div className={`p-4 rounded-xl border mb-4 flex items-center gap-2 text-xs font-bold ${passwordStatus.success ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-danger/10 border-danger/20 text-danger"}`}>
                          {passwordStatus.success ? <Check className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
                          <span>{passwordStatus.msg}</span>
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Current Password</label>
                          <input 
                            type="password"
                            required
                            placeholder="••••••••"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">New Password</label>
                          <input 
                            type="password"
                            required
                            placeholder="Min 6 characters"
                            value={passwordForm.newPass}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password</label>
                          <input 
                            type="password"
                            required
                            placeholder="Re-enter new password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="px-5 py-2.5 rounded-xl btn-primary-new text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>

                    <div className="border-t border-white/5 pt-6">
                      <div className="mb-6">
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary" />
                          <span>Notification Preferences</span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Control how you want to receive active updates.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-neutral-950/20">
                          <div>
                            <h4 className="text-xs font-bold text-white">Price Drop Alerts</h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">Receive immediate updates when a batch reaches a lower pricing tier.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleNotification("priceDrops")}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${notifications.priceDrops ? "bg-primary" : "bg-neutral-800"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.priceDrops ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-neutral-950/20">
                          <div>
                            <h4 className="text-xs font-bold text-white">Batch Lock Confirmations</h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">Get notified when orders lock and manufacturing starts.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleNotification("batchLocks")}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${notifications.batchLocks ? "bg-primary" : "bg-neutral-800"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.batchLocks ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-neutral-950/20">
                          <div>
                            <h4 className="text-xs font-bold text-white">Factory Production Milestones</h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">Receive real-time progress steps straight from the plant.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleNotification("productionUpdates")}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${notifications.productionUpdates ? "bg-primary" : "bg-neutral-800"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications.productionUpdates ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. WATCHLIST PANEL */}
                {activeTab === "saved" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <span>Watchlist & Saved Batches</span>
                      </h2>
                      <p className="text-xs text-neutral-500 mt-0.5">Batches you are tracking to join or monitor pricing status.</p>
                    </div>

                    {savedBatches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedBatches.map((batch) => (
                          <div key={batch.id} className="p-4 rounded-xl border border-white/5 bg-neutral-950/40 hover:border-white/10 transition-colors flex flex-col justify-between min-h-[140px] text-left">
                            <div>
                              <div className="flex justify-between items-start gap-4 mb-2">
                                <h4 className="font-display font-bold text-xs text-white line-clamp-2">{batch.title}</h4>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-neutral-800 text-neutral-400 flex-shrink-0">
                                  {batch.category}
                                </span>
                              </div>
                              <div className="flex items-end gap-1.5 text-neutral-500 text-[10px] mt-1.5">
                                <span>Moq: <strong>{batch.moq}</strong></span>
                                <span>•</span>
                                <span>Joined: <strong className="text-primary">{batch.currentSlots}</strong></span>
                              </div>
                            </div>
                            <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/5">
                              <Link 
                                href={`/batch/${batch.id}`}
                                className="px-3.5 py-1.5 rounded-lg btn-primary-new text-[10px] font-bold transition-all shadow shadow-primary/10 flex-1 text-center"
                              >
                                Join Batch
                              </Link>
                              <button 
                                onClick={() => setSavedBatches(prev => prev.filter(b => b.id !== batch.id))}
                                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-white transition-all cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-xl bg-neutral-900/10 text-neutral-500 text-xs">
                        No saved batches in your watchlist yet.
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────
         Add Shipping Address Modal
      ───────────────────────────────────────────── */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[1100]" onClick={() => setShowAddAddress(false)}>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 text-left relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowAddAddress(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer text-lg p-1"
            >
              ×
            </button>
            <h3 className="text-base font-display font-bold text-white mb-5">Add Delivery Location</h3>
            
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Location Label</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Home">Home Address</option>
                  <option value="Office">Office / Warehouse</option>
                  <option value="Other">Other Location</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Street / Building Info</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 102, Star Residency, Bandra West"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Postal / PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="400050"
                  value={newAddress.pin}
                  onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value.replace(/\D/g, "") })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 mt-2 rounded-xl btn-primary-new text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                Save Shipping Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
         Edit Shipping Address Modal
      ───────────────────────────────────────────── */}
      {showEditAddress && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[1100]" onClick={() => setShowEditAddress(null)}>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 text-left relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowEditAddress(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer text-lg p-1"
            >
              ×
            </button>
            <h3 className="text-base font-display font-bold text-white mb-5">Edit Location details</h3>
            
            <form onSubmit={handleEditAddressSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Location Label</label>
                <select
                  value={showEditAddress.type}
                  onChange={(e) => setShowEditAddress({ ...showEditAddress, type: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Home">Home Address</option>
                  <option value="Office">Office / Warehouse</option>
                  <option value="Other">Other Location</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Street / Building Info</label>
                <input
                  type="text"
                  required
                  value={showEditAddress.street}
                  onChange={(e) => setShowEditAddress({ ...showEditAddress, street: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    value={showEditAddress.city}
                    onChange={(e) => setShowEditAddress({ ...showEditAddress, city: e.target.value })}
                    className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    required
                    value={showEditAddress.state}
                    onChange={(e) => setShowEditAddress({ ...showEditAddress, state: e.target.value })}
                    className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Postal / PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={showEditAddress.pin}
                  onChange={(e) => setShowEditAddress({ ...showEditAddress, pin: e.target.value.replace(/\D/g, "") })}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 mt-2 rounded-xl btn-primary-new text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                Update Shipping Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
         Wallet Top-up Deposit Modal
      ───────────────────────────────────────────── */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[1100]" onClick={() => setShowDepositModal(false)}>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-sm w-full p-6 text-left relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer text-lg p-1"
            >
              ×
            </button>
            <h3 className="text-base font-display font-bold text-white mb-2">Deposit Funds</h3>
            <p className="text-[10px] text-neutral-500 mb-5">Simulate topping up your BulkCash balance instantly (Sandbox Mode).</p>
            
            <form onSubmit={handleDepositMoney} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Deposit Amount (₹)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value.replace(/\D/g, ""))}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["1000", "5000", "10000"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDepositAmount(v)}
                    className="py-1.5 border border-white/5 hover:border-white/20 bg-neutral-950 hover:bg-neutral-900 rounded-lg text-[10px] text-white font-bold cursor-pointer transition-colors"
                  >
                    + ₹{parseInt(v).toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              <button 
                type="submit" 
                disabled={isDepositing}
                className="w-full py-2.5 mt-2 rounded-xl btn-primary-new text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
              >
                {isDepositing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Add Money to Wallet</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
