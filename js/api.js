const client = supabase.createClient(
  "https://onnkknpizxgwcwvmmpln.supabase.co",
  "sb_publishable_NU8Z_ZLkY9PjgQBrKMJtsA_J7s8UcnS"
);

async function getCurrentUser() {
  const { data } = await client.auth.getUser();
  return data.user;
}

async function getProducts() {
  const user = await getCurrentUser();

  if (!user) {
  console.warn("User not logged in");
  return { data: [] };   // 🔥 FIX
  }

  return await client
    .from("products")
    .select("*")
    .eq("user_id", user.id);
}

async function addProductAPI(data) {
  const user = await getCurrentUser();

 if (!user) {
  console.warn("User not logged in");
  return;   // 🔥 FIX
  }

  return await client.from("products").insert([{
    ...data,
    user_id: user.id
  }]);
}

async function updateProductAPI(id, data) {
  const user = await getCurrentUser();

  if (!user) {
  console.warn("User not logged in");
  return;   // 🔥 FIX
  }

  return await client
    .from("products")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id);
}

async function deleteProductAPI(id) {
  const user = await getCurrentUser();

  if (!user) {
  console.warn("User not logged in");
  return;   // 🔥 FIX
  }

  return await client
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
}