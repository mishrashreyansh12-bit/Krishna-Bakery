import { supabase } from "../supabase";

// Save a new order to Supabase
export async function saveOrder({ customerName, contact, email, orderType, address, items, subtotal, discount, total, promoCode }) {
  // Try with email first
  const payload = {
    customer_name: customerName,
    contact,
    order_type:   orderType,
    address,
    items,
    subtotal,
    discount,
    total,
    promo_code:   promoCode || "",
    status:       "pending",
  };

  // Add email only if provided (in case column doesn't exist yet)
  if (email) payload.email = email;

  const { data, error } = await supabase
    .from("orders")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("saveOrder error:", error.message, error.details, error.hint);

    // If email column doesn't exist, retry without it
    if (error.message && error.message.includes("email")) {
      console.warn("Retrying without email field...");
      delete payload.email;
      const { data: data2, error: error2 } = await supabase
        .from("orders")
        .insert([payload])
        .select()
        .single();

      if (error2) {
        console.error("saveOrder retry error:", error2.message);
        return null;
      }
      return data2;
    }
    return null;
  }
  return data;
}
