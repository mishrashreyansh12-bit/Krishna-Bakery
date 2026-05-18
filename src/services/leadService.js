import { supabase } from "../supabase";

// Save chat lead (name + contact) to Supabase
export async function saveChatLead(name, contact) {
  const { error } = await supabase
    .from("chat_leads")
    .insert([{ name, contact }]);

  if (error) {
    console.error("saveChatLead error:", error.message);
  }
}
