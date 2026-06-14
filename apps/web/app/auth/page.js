"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const pin = otp.join("");
    if (pin.length !== 4) {
      alert("Please enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // On success, redirect to dashboard or home
      router.push("/");
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    alert("OTP Resent! (Sandbox SMS Logged)");
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`${provider} Login Successful! (Mocked Social Auth Sandbox)`);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="auth-container">
      {/* Left Column: Form */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          {/* Logo */}
          <Link href="/" className="auth-logo">
            <div className="auth-logo__icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="url(#auth-logo-grad)" />
                <path d="M8 20L12 10H15L11 20H8Z" fill="white" fillOpacity="0.9" />
                <path d="M14 20L18 10H21L17 20H14Z" fill="white" fillOpacity="0.9" />
                <path d="M20 20L24 10H27L23 20H20Z" fill="white" fillOpacity="0.7" />
                <defs>
                  <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#0D6EFD" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="auth-logo__text">BulkBlitz</span>
          </Link>

          {/* Dynamic Forms */}
          {!otpSent ? (
            <div className="form-content animate-fade-in-up">
              <h2 className="form-title">Verify Phone Number</h2>
              <p className="form-subtitle">Enter your details to create an account or sign in instantly.</p>
              
              <form onSubmit={handleSendOtp}>
                <div className="phone-input-group">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="phone-input"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn--primary w-full btn--lg"
                  disabled={loading || phoneNumber.length !== 10}
                  id="send-otp-btn"
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    "Send OTP Code"
                  )}
                </button>
              </form>

              <div className="divider-text">
                <span>or continue with</span>
              </div>

              <div className="social-actions">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="btn btn--social w-full"
                  disabled={loading}
                >
                  <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="btn btn--social w-full"
                  disabled={loading}
                >
                  <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="form-content animate-fade-in-up">
              <h2 className="form-title">Enter Verification Code</h2>
              <p className="form-subtitle">We sent a 4-digit code to +91 {phoneNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}</p>
              
              <form onSubmit={handleVerifyOtp}>
                <div className="otp-inputs">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="otp-box"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn--primary w-full btn--lg mb-4"
                  disabled={loading || otp.join("").length !== 4}
                  id="verify-otp-btn"
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>
                
                <div className="otp-resend-row">
                  {timer > 0 ? (
                    <span className="resend-timer">Resend OTP in <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" className="resend-btn" onClick={handleResend}>
                      Resend Verification Code
                    </button>
                  )}
                  <button type="button" className="change-phone-btn" onClick={() => setOtpSent(false)}>
                    Edit Phone
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form Footer */}
          <div className="auth-footer">
            <p className="terms-text">
              By proceeding, you agree to BulkBlitz&apos;s{" "}
              <Link href="#">Terms of Service</Link> and{" "}
              <Link href="#">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Decorative Banner */}
      <div className="auth-banner-side">
        <div className="banner-orb banner-orb--1"></div>
        <div className="banner-orb banner-orb--2"></div>
        <div className="banner-orb banner-orb--3"></div>
        
        <div className="banner-content">
          <span className="banner-badge">🚀 Bulk Price Revolution</span>
          <h1 className="banner-title">
            bulk up.<br />
            price down.
          </h1>
          <p className="banner-text">
            Join the crowd. Drop the price. Unlock wholesale pricing directly from verified manufacturers.
          </p>
          
          <div className="banner-stats">
            <div className="banner-stat-card glass-card">
              <span className="stat-value">₹24.8L+</span>
              <span className="stat-label">Total Saved</span>
            </div>
            <div className="banner-stat-card glass-card">
              <span className="stat-value">12.5k+</span>
              <span className="stat-label">Active Buyers</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 100vh;
          background-color: var(--bg-surface);
        }

        @media (min-width: 1024px) {
          .auth-container {
            grid-template-columns: 1.1fr 1fr;
          }
        }

        /* Form Side styling */
        .auth-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6) var(--space-8);
          position: relative;
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--text-primary);
        }

        .auth-logo__text {
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #0D6EFD, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .form-title {
          font-family: var(--font-heading), sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 var(--space-6);
        }

        /* Inputs styling */
        .phone-input-group {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: var(--space-5);
        }

        .phone-prefix {
          position: absolute;
          left: var(--space-4);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .phone-input {
          width: 100%;
          padding: var(--space-4) var(--space-4) var(--space-4) calc(var(--space-12) + 8px);
          border-radius: var(--radius-lg);
          border: 2px solid var(--border-default);
          font-size: 1.1rem;
          font-weight: 600;
          background: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .phone-input:focus {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
        }

        /* OTP Inputs */
        .otp-inputs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .otp-box {
          height: 64px;
          border-radius: var(--radius-lg);
          border: 2px solid var(--border-default);
          text-align: center;
          font-size: 1.6rem;
          font-weight: 800;
          background: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          transition: all var(--transition-fast);
        }

        .otp-box:focus {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
          box-shadow: 0 0 0 4px var(--accent-primary-light);
        }

        .otp-resend-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .resend-timer {
          color: var(--text-secondary);
        }

        .resend-btn {
          background: transparent;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .change-phone-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        /* Banner styling */
        .auth-banner-side {
          display: none;
          background: radial-gradient(circle at top right, #1f1b3d, #0A0A0F);
          position: relative;
          overflow: hidden;
          padding: var(--space-12) var(--space-16);
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid var(--border-default);
        }

        @media (min-width: 1024px) {
          .auth-banner-side {
            display: flex;
          }
        }

        .banner-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }

        .banner-orb--1 {
          width: 350px;
          height: 350px;
          background: #8B5CF6;
          top: -100px;
          right: -50px;
          animation: float 8s ease-in-out infinite;
        }

        .banner-orb--2 {
          width: 250px;
          height: 250px;
          background: #0D6EFD;
          bottom: 10%;
          left: -50px;
          animation: float 6s ease-in-out infinite reverse;
        }

        .banner-orb--3 {
          width: 180px;
          height: 180px;
          background: #34D399;
          top: 40%;
          right: 15%;
          animation: pulse 5s ease-in-out infinite;
        }

        .banner-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 480px;
        }

        .banner-badge {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #A78BFA;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          display: inline-block;
          margin-bottom: var(--space-4);
          letter-spacing: 0.05em;
        }

        .banner-title {
          font-family: var(--font-heading), sans-serif;
          font-size: clamp(2.5rem, 4.5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
          letter-spacing: -0.03em;
        }

        .banner-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 0 0 var(--space-10);
        }

        .banner-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .banner-stat-card {
          padding: var(--space-5) var(--space-6);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(16px);
          color: white;
        }

        .stat-value {
          display: block;
          font-family: var(--font-heading), sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 2px;
          background: linear-gradient(135deg, #FFF, #D8B4FE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-footer {
          margin-top: auto;
        }

        .terms-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          line-height: 1.4;
          text-align: center;
          margin: 0;
        }

        .terms-text :global(a) {
          color: var(--text-secondary);
          text-decoration: underline;
        }

        /* Social Logins */
        .divider-text {
          display: flex;
          align-items: center;
          text-align: center;
          margin: var(--space-6) 0;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .divider-text::before,
        .divider-text::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-default);
        }

        .divider-text:not(:empty)::before {
          margin-right: var(--space-4);
        }

        .divider-text:not(:empty)::after {
          margin-left: var(--space-4);
        }

        .social-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          margin-bottom: var(--space-2);
        }

        .btn--social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          background: var(--bg-surface);
          border: 1.5px solid var(--border-default);
          color: var(--text-primary);
          padding: var(--space-3) var(--space-4);
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn--social:hover:not(:disabled) {
          border-color: var(--text-secondary);
          background: var(--bg-elevated);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .btn--social:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .social-icon {
          flex-shrink: 0;
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
    </div>
  );
}
