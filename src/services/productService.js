import { supabase } from "../supabase";

// Fetch all products from Supabase
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchProducts error:", error.message);
    return [];
  }
  return data;
}

// Fetch products by category
export async function fetchProductsByCategory(category) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchProductsByCategory error:", error.message);
    return [];
  }
  return data;
}
