"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export default function CreateBatchWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState({
    title: "",
    description: "",
    category: "fmcg",
    moq: 10,
    maxSlots: 100,
    endTime: "",
    weight: "",
    material: "",
    certification: "",
  });

  const [tiers, setTiers] = useState([
    { minSlots: 1, maxSlots: 20, price: "" },
    { minSlots: 21, maxSlots: 50, price: "" },
    { minSlots: 51, maxSlots: 100, price: "" },
  ]);

  const handleAddField = () => {
    const lastTier = tiers[tiers.length - 1];
    const nextMin = lastTier ? parseInt(lastTier.maxSlots) + 1 : 1;
    const nextMax = lastTier ? parseInt(lastTier.maxSlots) * 2 : 50;
    setTiers([...tiers, { minSlots: nextMin, maxSlots: nextMax, price: "" }]);
  };

  const handleRemoveField = (idx) => {
    if (tiers.length === 1) return;
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx, field, val) => {
    const updated = [...tiers];
    updated[idx][field] = val;
    setTiers(updated);
  };

  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Batch Launched successfully! Your listing is now LIVE.");
      router.push("/manufacturer");
    }, 1500);
  };

  return (
    <>
      <Header />

      <main className="wizard-main">
        <div className="container">
          
          {/* Page Title & Progress */}
          <div className="wizard-header animate-fade-in">
            <h1 className="wizard-title">Launch a New Batch</h1>
            <p className="wizard-subtitle">Create a dynamic, crowd-powered volume pricing batch in minutes.</p>
            
            {/* Stepper Status Indicator */}
            <div className="wizard-progress-bar">
              <div className="wizard-steps-line">
                <div 
                  className="wizard-steps-fill" 
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
              {[
                { num: 1, label: "Product Info" },
                { num: 2, label: "Price Tiers" },
                { num: 3, label: "Preview & Launch" },
              ].map((s) => (
                <div 
                  key={s.num} 
                  className={`wizard-step ${step >= s.num ? "wizard-step--active" : ""} ${step === s.num ? "wizard-step--current" : ""}`}
                >
                  <div className="step-circle">{s.num}</div>
                  <span className="step-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Wizard Body */}
          <div className="wizard-content card animate-fade-in-up">
            
            {/* STEP 1: PRODUCT INFO */}
            {step === 1 && (
              <div className="wizard-step-body">
                <h3>Step 1: Catalog Details</h3>
                <p className="step-desc">Enter your product information, metadata, and scheduled time window.</p>
                
                <div className="wizard-form-grid">
                  <div className="form-group span-2">
                    <label>Batch Listing Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Basmati Rice (100% Organic, 1kg)"
                      value={batchData.title}
                      onChange={(e) => setBatchData({ ...batchData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Product Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe raw materials, certifications, bulk shipping packaging info, etc..."
                      value={batchData.description}
                      onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Product Category</label>
                    <select
                      value={batchData.category}
                      onChange={(e) => setBatchData({ ...batchData, category: e.target.value })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Batch Close Date</label>
                    <input
                      type="date"
                      value={batchData.endTime}
                      onChange={(e) => setBatchData({ ...batchData, endTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Min Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      value={batchData.moq}
                      onChange={(e) => setBatchData({ ...batchData, moq: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Target Slots Available</label>
                    <input
                      type="number"
                      value={batchData.maxSlots}
                      onChange={(e) => setBatchData({ ...batchData, maxSlots: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Material / Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Cotton, Stainless Steel"
                      value={batchData.material}
                      onChange={(e) => setBatchData({ ...batchData, material: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight / Packaging Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg, 500 ml"
                      value={batchData.weight}
                      onChange={(e) => setBatchData({ ...batchData, weight: e.target.value })}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Product Images</label>
                    <div className="upload-dropzone">
                      <div className="upload-icon">📁</div>
                      <p>Drag and drop product images here, or <span>browse files</span></p>
                      <span className="upload-help">Supports PNG, JPG (Max 5MB each)</span>
                    </div>
                  </div>
                </div>

                <div className="wizard-actions">
                  <button 
                    className="btn btn--primary" 
                    onClick={() => setStep(2)}
                    disabled={!batchData.title || !batchData.description}
                  >
                    Next Step: Pricing Tiers →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING TIERS */}
            {step === 2 && (
              <div className="wizard-step-body">
                <h3>Step 2: Dynamic Pricing ladder</h3>
                <p className="step-desc">Establish different price points. As more buyers reserve slots, the final price drops for everyone.</p>

                <div className="tier-builder-list">
                  {tiers.map((tier, idx) => (
                    <div key={idx} className="tier-builder-row">
                      <div className="tier-index-badge">Tier {idx + 1}</div>
                      
                      <div className="form-group">
                        <label>Min Slots</label>
                        <input
                          type="number"
                          value={tier.minSlots}
                          onChange={(e) => handleTierChange(idx, "minSlots", e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Max Slots</label>
                        <input
                          type="number"
                          value={tier.maxSlots}
                          onChange={(e) => handleTierChange(idx, "maxSlots", e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Price Per Unit (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 250"
                          value={tier.price}
                          onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                        />
                      </div>

                      <button 
                        className="tier-remove-btn" 
                        onClick={() => handleRemoveField(idx)}
                        disabled={tiers.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button className="btn btn--secondary btn--sm mb-6" onClick={handleAddField}>
                  + Add Price Drop Tier
                </button>

                <div className="wizard-actions">
                  <button className="btn btn--ghost" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button 
                    className="btn btn--primary" 
                    onClick={() => setStep(3)}
                    disabled={tiers.some((t) => !t.price)}
                  >
                    Next Step: Preview & Launch →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PREVIEW & LAUNCH */}
            {step === 3 && (
              <div className="wizard-step-body">
                <h3>Step 3: Confirm and Launch</h3>
                <p className="step-desc">Verify your details. Launching will immediately list this batch on the homepage discover feed.</p>

                <div className="preview-summary">
                  <div className="preview-item">
                    <span className="preview-label">Product Name</span>
                    <span className="preview-value">{batchData.title}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Category</span>
                    <span className="preview-value">{batchData.category.toUpperCase()}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">MOQ Target</span>
                    <span className="preview-value">{batchData.moq} slots</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Dynamic Pricing Tiers</span>
                    <div className="preview-tiers-list">
                      {tiers.map((t, idx) => (
                        <div key={idx} className="preview-tier-pill">
                          <strong>{t.minSlots}-{t.maxSlots} slots:</strong> ₹{t.price}/unit
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="wizard-actions">
                  <button className="btn btn--ghost" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button 
                    className="btn btn--success btn--lg" 
                    onClick={handleLaunch}
                    disabled={loading}
                    id="launch-batch-btn"
                  >
                    {loading ? <span className="spinner"></span> : "🚀 Launch Batch Now"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .wizard-main {
          padding-top: calc(64px + var(--space-8));
          padding-bottom: var(--space-16);
          min-height: calc(100vh - 150px);
          background-color: var(--bg-primary);
        }

        .wizard-header {
          margin-bottom: var(--space-8);
        }

        .wizard-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
        }

        .wizard-subtitle {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin: 0 0 var(--space-8);
        }

        /* Stepper progress bar */
        .wizard-progress-bar {
          display: flex;
          justify-content: space-between;
          position: relative;
          max-width: 600px;
          margin-top: var(--space-6);
        }

        .wizard-steps-line {
          position: absolute;
          top: 18px;
          left: 5%;
          right: 5%;
          height: 3px;
          background: var(--border-default);
          z-index: 1;
        }

        .wizard-steps-fill {
          height: 100%;
          background: var(--accent-primary);
          transition: width var(--transition-base);
        }

        .wizard-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          gap: 6px;
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 3px solid var(--border-default);
          color: var(--text-secondary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
        }

        .step-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-tertiary);
          transition: color var(--transition-base);
        }

        .wizard-step--active .step-circle {
          border-color: var(--accent-primary);
          background-color: var(--accent-primary-light);
          color: var(--accent-primary);
        }

        .wizard-step--active .step-label {
          color: var(--text-primary);
        }

        .wizard-step--current .step-circle {
          background-color: var(--accent-primary);
          color: white;
          box-shadow: 0 0 0 4px var(--accent-primary-light);
        }

        .wizard-step--current .step-label {
          font-weight: 700;
          color: var(--accent-primary);
        }

        /* Form styling */
        .wizard-content {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          max-width: 800px;
          margin: 0 auto;
        }

        .wizard-step-body h3 {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 var(--space-1);
          color: var(--text-primary);
        }

        .step-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0 0 var(--space-6);
        }

        .wizard-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-5);
        }

        @media (min-width: 640px) {
          .wizard-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .span-2 {
          grid-column: span 1;
        }

        @media (min-width: 640px) {
          .span-2 {
            grid-column: span 2;
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
        .form-group textarea,
        .form-group select {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
          transition: all var(--transition-fast);
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
        }

        /* Drag-and-drop Upload */
        .upload-dropzone {
          border: 2px dashed var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-4);
          text-align: center;
          cursor: pointer;
          background: var(--bg-primary);
          transition: all var(--transition-fast);
        }

        .upload-dropzone:hover {
          border-color: var(--accent-primary);
          background: var(--accent-primary-light) 05;
        }

        .upload-icon {
          font-size: 2.2rem;
          margin-bottom: var(--space-2);
        }

        .upload-dropzone p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0 0 var(--space-1);
        }

        .upload-dropzone p span {
          color: var(--accent-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .upload-help {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* Tier builder row */
        .tier-builder-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .tier-builder-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr) auto;
          gap: var(--space-4);
          align-items: flex-end;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-6);
          position: relative;
        }

        .tier-index-badge {
          position: absolute;
          top: -10px;
          left: 16px;
          background: var(--accent-premium-light);
          color: var(--accent-premium);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .tier-remove-btn {
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 var(--space-2) var(--space-2);
          transition: color var(--transition-fast);
        }

        .tier-remove-btn:hover {
          color: var(--accent-danger);
        }

        /* Preview card styling */
        .preview-summary {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          background-color: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          border: 1px solid var(--border-default);
          margin-bottom: var(--space-8);
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .preview-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .preview-tiers-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-top: 4px;
        }

        .preview-tier-pill {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-default);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .wizard-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-4);
          border-top: 1px solid var(--border-default);
          padding-top: var(--space-6);
          margin-top: var(--space-6);
        }

        /* Spinner for loading state */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
