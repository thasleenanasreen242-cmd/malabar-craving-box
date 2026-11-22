"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "9847641809@ptyes";
const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Malabar Craving Box";

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAmount(params.get("amount") || "");
    setOrderRef((params.get("order") || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40));
  }, []);

  const numericAmount = Number(amount);
  const validAmount = amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount > 0 && numericAmount <= 100000;

  const paymentUri = useMemo(() => {
    if (!validAmount) return "";
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: numericAmount.toFixed(2),
      cu: "INR",
      tn: orderRef ? `Malabar Craving Box order ${orderRef}` : "Malabar Craving Box order",
      ...(orderRef ? { tr: orderRef } : {}),
    });
    return `upi://pay?${params.toString()}`;
  }, [validAmount, numericAmount, orderRef]);

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6EBDD] px-4 py-6 text-[#30201E] sm:px-5 sm:py-8">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-xs uppercase tracking-[.16em] text-[#75513B]">← Malabar Craving Box</Link>
        <section className="paper mt-6 min-w-0 border border-[#E8D7C1] p-4 shadow-sm sm:p-7 md:p-9">
          <div className="text-center">
            <div className="eyebrow text-[#9a7047]">SECURE YOUR CRAVING</div>
            <h1 className="serif mt-3 text-[clamp(2rem,9vw,2.5rem)] leading-tight text-[#4A1725]">Make your payment</h1>
            <p className="mt-3 text-sm leading-6 text-[#75513B]">Pay for your Malabar Craving Box order using GPay or another UPI app.</p>
          </div>

          <div className="mt-8 border border-[#d9c5ab] bg-[#fffaf2] p-5 text-center">
            <div className="eyebrow text-[#9a7047]">AMOUNT TO PAY</div>
            {validAmount ? <div className="serif mt-2 break-words text-[clamp(2rem,9vw,3rem)] text-[#4A1725]">₹{numericAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div> : <div className="mt-3 text-sm text-[#7b2334]">Payment amount is missing or invalid.</div>}
            {orderRef && <div className="mt-3 text-xs tracking-wide text-[#75513B]">ORDER REF: {orderRef}</div>}
          </div>

          <div className="mt-6">
            <div className="text-[10px] font-semibold tracking-[.18em] text-[#9a7047]">PAYMENT UPI ID</div>
            <div className="mt-2 flex items-center justify-between gap-3 border border-[#d9c5ab] bg-[#fffaf2] p-3">
              <span className="break-all text-sm font-semibold text-[#4A1725]">{UPI_ID}</span>
              <button type="button" onClick={copyUpiId} className="shrink-0 text-xs font-semibold text-[#75513B] underline underline-offset-4">{copied ? "Copied" : "Copy"}</button>
            </div>
          </div>

          {validAmount ? (
            <a href={paymentUri} className="mt-7 flex w-full items-center justify-center bg-[#4A1725] px-6 py-4 text-center text-[11px] font-semibold tracking-[.16em] text-[#F6EBDD] transition hover:bg-[#681F32]">OPEN GPAY / UPI APP ↗</a>
          ) : (
            <div className="mt-7 bg-[#ead8c2] px-5 py-4 text-center text-xs leading-5 text-[#75513B]">Ask Malabar Craving Box for a valid payment link containing your order amount.</div>
          )}

          <div className="mt-5 border-t border-[#d9c5ab] pt-5 text-xs leading-6 text-[#75513B]">
            <strong className="text-[#4A1725]">Please check before paying.</strong>
            <p>Confirm the payee name and amount in your UPI app before approving the payment. Do not pay if the details do not match your order.</p>
            <p className="mt-2">Your order is confirmed only after the business verifies the payment and confirms availability. A payment app redirect alone is not proof of successful payment.</p>
          </div>
        </section>
        <p className="mt-5 text-center text-[10px] tracking-[.12em] text-[#75513B]">HOMEMADE WITH LOVE IN MALABAR</p>
      </div>
    </main>
  );
}
