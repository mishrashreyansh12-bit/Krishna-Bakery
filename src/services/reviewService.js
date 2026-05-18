import { supabase } from "../supabase";

// Fetch all reviews
export async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("fetchReviews error:", error.message);
    return [];
  }
  return data;
}

// Save a new review
export async function saveReview({ name, rating, comment, product }) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([{ name, rating, comment, product: product || "General" }])
    .select()
    .single();

  if (error) {
    console.error("saveReview error:", error.message);
    return null;
  }
  return data;
}
