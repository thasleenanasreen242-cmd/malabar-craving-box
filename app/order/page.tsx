"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const boxes = [
  { id: "mini", name: "Mini Malabar Box", price: 299, pieces: "5 pieces", contents: "2 samosas, 1 cutlet, 1 unnakaya, 1 chatti pathiri piece" },
  { id: "feast", name: "Malabar Feast Box", price: 499, pieces: "9 pieces", contents: "2 samosas, 2 cutlets, 2 unnakaya, 2 chatti pathiri pieces, 1 kozhi ada or veg ada" },
  { id: "grand", name: "Grand Malabar Box", price: 899, pieces: "17 items", contents: "4 samosas, 3 cutlets, 3 unnakaya, 3 chatti pathiri pieces, 3 ada, 1 rotating Malabar speciality" },
];

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\\D/g, "") ?? "";

export default function OrderPage() {
  const [boxId, setBoxId] = useState("feast");
  const [variant, setVariant] = useState("Chicken");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [fulfilment, setFulfilment] = useState("Delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selected = boxes.find((box) => box.id === boxId) ?? boxes[1];
  const subtotal = selected.price * quantity;
  const message = useMemo(() => [
    "Hello Malabar Craving Box! I'd like to place a pre-order.",
    "",
    `Name: ${name}`,
    `Customer WhatsApp: ${phone}`,
    `Box: ${selected.name}`,
    `Preference: ${variant}`,
    `Quantity: ${quantity}`,
    `Pre-order date: ${date}`,
    `Fulfilment: ${fulfilment}`,
    ...(fulfilment === "Delivery" ? [`Delivery address: ${address}`] : []),
    `Estimated box subtotal: ₹${subtotal}`,
    "Delivery charges: to be confirmed separately",
    ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
    "",
    "Please confirm availability and the final total.",
  ].join("\n"), [name, phone, selected, variant, quantity, date, fulfilment, address, subtotal, notes]);

  function submitOrder() {
    if (!name.trim() || !/^\\+?[0-9\\s-]{10,15}$/.test(phone.trim()) || !date || (fulfilment === "Delivery" && !address.trim())) {
      setError("Please complete your name, a valid contact number, pre-order date and delivery address (if applicable).");
      return;
    }
    if (!whatsappNumber) {
      setError("WhatsApp ordering is not activated yet. The business WhatsApp number needs to be added by the owner before orders can be sent.");
      return;
    }
    setError("");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#F6EBDD] text-[#30201E]">
      <div className="bg-[#4A1725] px-4 py-2 text-center text-[9px] tracking-[.22em] text-[#F6EBDD]">HOMEMADE WITH LOVE IN MALABAR · PRE-ORDERS</div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/" className="leading-none"><span className="serif block text-xl font-bold tracking-[.08em] text-[#4A1725]">MALABAR</span><span className="mt-1 block text-[9px] tracking-[.36em] text-[#75513B]">CRAVING BOX</span></Link>
        <Link href="/" className="text-[10px] uppercase tracking-[.16em] text-[#75513B]">← Back to home</Link>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 pt-5 lg:grid-cols-[1.3fr_.7fr]">
        <section className="paper border border-[#E8D7C1] p-6 md:p-9">
          <div className="eyebrow text-[#9a7047]">YOUR MALABAR MOMENT</div>
          <h1 className="serif mt-3 text-4xl text-[#4A1725] md:text-5xl">Build your box order.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#75513B]">Choose your favourite box, tell us your preference and send your pre-order request. We’ll confirm availability and delivery charges before the order is final.</p>

          <div className="mt-8">
            <label className="eyebrow text-[#75513B]">01 · CHOOSE YOUR BOX</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {boxes.map((box) => <button type="button" key={box.id} onClick={() => setBoxId(box.id)} className={`text-left border p-4 transition ${boxId === box.id ? "border-[#4A1725] bg-[#ead8c2] shadow-sm" : "border-[#E8D7C1] bg-[#fffaf2] hover:border-[#b58a55]"}`}>
                <span className="serif block text-lg text-[#4A1725]">{box.name}</span>
                <span className="mt-1 block text-xs text-[#75513B]">{box.pieces}</span>
                <span className="serif mt-3 block text-2xl text-[#4A1725]">₹{box.price}</span>
                <span className="mt-2 block text-[10px] leading-5 text-[#75513B]">{box.contents}</span>
              </button>)}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div><label htmlFor="variant" className="eyebrow text-[#75513B]">02 · BOX PREFERENCE</label><select id="variant" value={variant} onChange={(e) => setVariant(e.target.value)} className="mt-3 w-full border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]"><option>Chicken</option><option>Veg</option></select></div>
            <div><label htmlFor="quantity" className="eyebrow text-[#75513B]">03 · QUANTITY</label><input id="quantity" type="number" min="1" max="20" value={quantity} onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="mt-3 w-full border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" /></div>
          </div>

          <div className="mt-8"><label htmlFor="date" className="eyebrow text-[#75513B]">04 · PRE-ORDER DATE</label><input id="date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="mt-3 w-full border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" /></div>

          <div className="mt-8"><label className="eyebrow text-[#75513B]">05 · DELIVERY OR PICKUP</label><div className="mt-3 grid grid-cols-2 gap-3">{["Delivery", "Pickup"].map((choice) => <button type="button" key={choice} onClick={() => setFulfilment(choice)} className={`border p-3 text-sm ${fulfilment === choice ? "border-[#4A1725] bg-[#ead8c2] text-[#4A1725]" : "border-[#d9c5ab] bg-[#fffaf2] text-[#75513B]"}`}>{choice}</button>)}</div></div>

          <div className="mt-8 border-t border-[#d9c5ab] pt-7">
            <label className="eyebrow text-[#75513B]">06 · YOUR DETAILS</label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input aria-label="Your name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" />
              <input aria-label="Your WhatsApp number" placeholder="Your WhatsApp / mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" />
            </div>
            {fulfilment === "Delivery" && <textarea aria-label="Delivery address" placeholder="Full delivery address, including area and PIN code" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="mt-4 w-full border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" />}
            <textarea aria-label="Order notes" placeholder="Any notes for us? (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-4 w-full border border-[#d9c5ab] bg-[#fffaf2] p-3 text-sm outline-none focus:border-[#4A1725]" />
          </div>
          {error && <p role="alert" className="mt-5 border border-[#9b3949]/30 bg-[#9b3949]/10 p-3 text-sm text-[#7b2334]">{error}</p>}
          <button type="button" onClick={submitOrder} className="mt-7 w-full bg-[#4A1725] px-6 py-4 text-[10px] font-semibold tracking-[.2em] text-[#F6EBDD] transition hover:bg-[#681F32]">SEND PRE-ORDER REQUEST ON WHATSAPP ↗</button>
          <p className="mt-3 text-center text-[10px] leading-5 text-[#75513B]">Your order is a request until availability, delivery and final pricing are confirmed by the business.</p>
        </section>

        <aside className="h-fit border border-[#d9c5ab] bg-[#fffaf2] p-6 lg:sticky lg:top-6">
          <div className="eyebrow text-[#9a7047]">YOUR ORDER SUMMARY</div>
          <h2 className="serif mt-3 text-2xl text-[#4A1725]">{selected.name}</h2>
          <p className="mt-1 text-xs text-[#75513B]">{variant} · {selected.pieces}</p>
          <div className="mt-6 space-y-3 border-t border-[#e8d7c1] pt-5 text-sm"><div className="flex justify-between"><span className="text-[#75513B]">Box price</span><span>₹{selected.price}</span></div><div className="flex justify-between"><span className="text-[#75513B]">Quantity</span><span>× {quantity}</span></div><div className="flex justify-between border-t border-[#e8d7c1] pt-4 font-semibold"><span>Subtotal</span><span className="serif text-2xl text-[#4A1725]">₹{subtotal}</span></div><div className="flex justify-between text-xs"><span className="text-[#75513B]">Delivery</span><span>To be confirmed</span></div></div>
          <div className="mt-6 bg-[#F6EBDD] p-4 text-xs leading-6 text-[#75513B]"><strong className="text-[#4A1725]">A little note</strong><br/>We prepare in limited batches. Please place your request ahead of time. Your date is subject to kitchen capacity and delivery-area availability.</div>
        </aside>
      </div>
      <footer className="border-t border-[#d9c5ab] px-5 py-7 text-center text-[10px] tracking-[.15em] text-[#75513B]">MALABAR CRAVING BOX · MADE WITH LOVE IN MALABAR</footer>
    </main>
  );
}
