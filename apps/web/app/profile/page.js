"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    trustScore: 100,
    joinedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [savedBatches, setSavedBatches] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    pin: "",
  });

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
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedBatches() {
    try {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const data = await res.json();
        setSavedBatches(data.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to load saved batches:", err);
    }
  }

  useEffect(() => {
    loadProfile();
    loadSavedBatches();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      if (res.ok) {
        setIsEditing(false);
        alert("Profile details updated successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Server error occurred while saving profile");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pin) {
      alert("Please fill all fields");
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
        alert("New address added successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add address");
      }
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Server error occurred while adding address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/profile/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        alert("Address deleted successfully!");
        loadProfile();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Server error occurred while deleting address");
    }
  };

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
        alert("Default address updated successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update default address");
      }
    } catch (err) {
      console.error("Error setting default address:", err);
      alert("Server error occurred while setting default address");
    }
  };


  return (
    <>
      <Header />

      <main className="profile-main">
        <div className="container">
          
          {/* Profile Welcome Banner */}
          <div className="profile-banner animate-fade-in">
            <div className="profile-banner__orb profile-banner__orb--1"></div>
            <div className="profile-banner__orb profile-banner__orb--2"></div>
            <div className="profile-banner__content">
              <div className="user-profile-header">
                <div className="user-avatar-large">
                  {profile.name.charAt(0)}
                </div>
                <div className="user-header-details">
                  <h1 className="user-name">{profile.name || "Loading..."}</h1>
                  <span className="user-join-date">Member since {profile.joinedAt ? formatDate(profile.joinedAt) : "..."}</span>
                </div>
              </div>
              <div className="trust-score-badge">
                <div className="trust-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart green">
                    <path className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                      strokeDasharray={`${profile.trustScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="percentage">{profile.trustScore}</div>
                </div>
                <div className="trust-text">
                  <span>Trust Score</span>
                  <span className="trust-desc">Excellent Buyer Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tab Navigation */}
          <div className="profile-tabs animate-fade-in-up">
            <button
              className={`profile-tab ${activeTab === "info" ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              👤 Personal Info
            </button>
            <button
              className={`profile-tab ${activeTab === "addresses" ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              📍 Saved Addresses
            </button>
            <button
              className={`profile-tab ${activeTab === "saved" ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              ❤️ Saved Batches
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="profile-content animate-fade-in-up animate-delay-100">
            
            {/* PERSONAL INFO TAB */}
            {activeTab === "info" && (
              <div className="card-section">
                <div className="card-section__header">
                  <h3 className="section-title">Personal Details</h3>
                  {!isEditing && (
                    <button className="btn btn--secondary btn--sm" onClick={() => setIsEditing(true)}>
                      Edit Details
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="profile-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" value={profile.phone} disabled={true} />
                      <span className="form-input-help">Phone number cannot be changed (OTP verified)</span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-actions mt-6">
                      <button type="submit" className="btn btn--primary">
                        Save Changes
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={() => {
                        loadProfile();
                        setIsEditing(false);
                      }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="card-section">
                <div className="card-section__header">
                  <h3 className="section-title">Addresses</h3>
                  <button className="btn btn--secondary btn--sm" onClick={() => setShowAddAddress(true)}>
                    + Add Address
                  </button>
                </div>

                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? "address-card--default" : ""}`}>
                      <div className="address-card__header">
                        <span className="address-type">{addr.type}</span>
                        {addr.isDefault && <span className="default-badge">DEFAULT</span>}
                      </div>
                      <p className="address-text">
                        {addr.street}<br />
                        {addr.city}, {addr.state} - <strong>{addr.pin}</strong>
                      </p>
                      <div className="address-card__actions">
                        {!addr.isDefault && (
                          <button className="action-btn-text" onClick={() => handleSetDefaultAddress(addr.id)}>
                            Set Default
                          </button>
                        )}
                        <button className="action-btn-text action-btn-text--danger" onClick={() => handleDeleteAddress(addr.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SAVED BATCHES (WISHLIST) TAB */}
            {activeTab === "saved" && (
              <div className="card-section">
                <h3 className="section-title mb-6">Saved Batches</h3>
                <div className="saved-batches-list">
                  {savedBatches.map((batch) => (
                    <div key={batch.id} className="saved-batch-row">
                      <div className="saved-batch-info">
                        <h4>{batch.title}</h4>
                        <span className="category-tag">{batch.category}</span>
                      </div>
                      <div className="saved-batch-actions">
                        <Link href={`/batch/${batch.id}`} className="btn btn--primary btn--sm">
                          Join Batch
                        </Link>
                        <button className="btn btn--ghost btn--sm">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="modal-overlay" onClick={() => setShowAddAddress(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddAddress(false)}>×</button>
            <h3>Add Shipping Address</h3>
            
            <form onSubmit={handleAddAddress} className="modal-form">
              <div className="form-group mb-4">
                <label>Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="modal-select"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Street / Building Details</label>
                <input
                  type="text"
                  placeholder="Street and Room/Flat No."
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid mb-6">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    placeholder="PIN Code"
                    maxLength={6}
                    value={newAddress.pin}
                    onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value.replace(/\D/g, "") })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary w-full">
                Add Address
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .profile-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: var(--bg-primary);
        }

        /* Profile Banner styling */
        .profile-banner {
          background: linear-gradient(135deg, #1e1b4b, #311042);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
          color: white;
          box-shadow: var(--shadow-lg);
          margin-bottom: var(--space-8);
        }

        .profile-banner__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.25;
        }

        .profile-banner__orb--1 {
          width: 250px;
          height: 250px;
          background: #8B5CF6;
          top: -50px;
          right: -50px;
        }

        .profile-banner__orb--2 {
          width: 200px;
          height: 200px;
          background: #10B981;
          bottom: -50px;
          left: 40%;
        }

        .profile-banner__content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-6);
        }

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-5);
        }

        .user-avatar-large {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .user-name {
          font-family: var(--font-heading), sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }

        .user-join-date {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Trust Score Circular Chart */
        .trust-score-badge {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(8px);
        }

        .trust-circle {
          width: 50px;
          height: 50px;
          position: relative;
        }

        .circular-chart {
          display: block;
          max-width: 100%;
          max-height: 100%;
        }

        .circle-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 2.8;
        }

        .circle {
          fill: none;
          stroke: #10B981;
          stroke-width: 2.8;
          stroke-linecap: round;
        }

        .percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: white;
        }

        .trust-text {
          display: flex;
          flex-direction: column;
        }

        .trust-text span:first-child {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .trust-desc {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Tabs Navigation */
        .profile-tabs {
          display: flex;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-default);
          padding-bottom: var(--space-2);
          overflow-x: auto;
        }

        .profile-tab {
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          transition: all var(--transition-fast);
          border-radius: var(--radius-md);
          white-space: nowrap;
        }

        .profile-tab:hover {
          color: var(--text-primary);
          background-color: var(--bg-elevated);
        }

        .profile-tab--active {
          color: var(--accent-primary);
          background-color: var(--accent-primary-light);
        }

        /* Card sections */
        .card-section {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
        }

        .card-section__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .section-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        /* Profile details form */
        .profile-form {
          display: flex;
          flex-direction: column;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input,
        .form-group select {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-weight: 500;
          outline: none;
          transition: all var(--transition-fast);
        }

        .form-group input:focus:not(:disabled),
        .form-group select:focus:not(:disabled) {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
        }

        .form-group input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-input-help {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .form-actions {
          display: flex;
          gap: var(--space-3);
        }

        /* Address layout */
        .address-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 768px) {
          .address-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .address-card {
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          position: relative;
          transition: border-color var(--transition-fast);
        }

        .address-card--default {
          border-color: var(--accent-success);
          background: var(--accent-success-light) 10;
        }

        .address-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .address-type {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .default-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent-success);
          background: var(--accent-success-light);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .address-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 var(--space-4);
        }

        .address-card__actions {
          display: flex;
          gap: var(--space-4);
        }

        .action-btn-text {
          border: none;
          background: transparent;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-primary);
          cursor: pointer;
          padding: 0;
          transition: opacity var(--transition-fast);
        }

        .action-btn-text:hover {
          opacity: 0.8;
        }

        .action-btn-text--danger {
          color: var(--accent-danger);
        }

        /* Saved batches wishlist styling */
        .saved-batch-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--border-light);
          gap: var(--space-4);
        }

        .saved-batch-row:last-child {
          border-bottom: none;
        }

        .saved-batch-info h4 {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          margin: 0 0 var(--space-1);
          color: var(--text-primary);
        }

        .category-tag {
          font-size: 0.7rem;
          color: var(--text-secondary);
          background: var(--bg-elevated);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .saved-batch-actions {
          display: flex;
          gap: var(--space-2);
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 17, 23, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .modal-content {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          width: 90%;
          max-width: 500px;
          padding: var(--space-8);
          position: relative;
          box-shadow: var(--shadow-xl);
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
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 var(--space-5);
          color: var(--text-primary);
        }

        .modal-select {
          width: 100%;
        }

        .modal-form input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
        }

        .modal-form input:focus {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
        }
      `}</style>
    </>
  );
}
