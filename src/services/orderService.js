import { supabase } from "../supabase";

// ── Save a new order ──────────────────────────────────────────────────────────
export async function saveOrder({
  customerName, contact, email,
  orderType, address,
  items, subtotal, discount, comboDiscount, total,
  promoCode, deliveryDate, notes,
}) {
  const payload = {
    customer_name:   customerName,
    contact,
    order_type:      orderType,
    address,
    items,
    subtotal,
    discount:        discount || 0,
    combo_discount:  comboDiscount || 0,
    total,
    promo_code:      promoCode || "",
    delivery_date:   deliveryDate || "",
    notes:           notes || "",
    status:          "pending",
    tracking_status: "confirmed",
  };

  if (email) payload.email = email;

  const { data, error } = await supabase
    .from("orders")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("saveOrder error:", error.message);
    // retry without optional fields
    const fallback = {
      customer_name: customerName,
      contact,
      order_type:    orderType,
      address,
      items,
      subtotal,
      discount:      discount || 0,
      total,
      promo_code:    promoCode || "",
      status:        "pending",
    };
    const { data: d2, error: e2 } = await supabase
      .from("orders").insert([fallback]).select().single();
    if (e2) { console.error("saveOrder fallback error:", e2.message); return null; }
    // save contact for order history
    if (typeof window !== "undefined") localStorage.setItem("kb_contact", contact);
    return d2;
  }
  // save contact for order history lookup
  if (typeof window !== "undefined") localStorage.setItem("kb_contact", contact);
  // update loyalty points
  if (typeof window !== "undefined") {
    const prev = parseInt(localStorage.getItem("kb_points") || "0");
    const earned = Math.floor(total / 100) * 10;
    localStorage.setItem("kb_points", String(prev + earned));
  }
  return data;
}

// ── Get order by ID (for tracking) ───────────────────────────────────────────
export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error) { console.error("getOrderById error:", error.message); return null; }
  return data;
}

// ── Get orders by contact (for order history) ─────────────────────────────────
export async function getOrdersByContact(contact) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("contact", contact)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) { console.error("getOrdersByContact error:", error.message); return []; }
  return data || [];
}
