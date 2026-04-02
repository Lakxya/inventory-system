let allProducts = [];
let editingId = null;

// 🔐 WAIT FOR SESSION (CRITICAL FIX)
async function waitForSession() {
  let session = null;

  while (!session) {
    const { data } = await client.auth.getSession();
    session = data.session;

    if (!session) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

// 🔐 CHECK AUTH
async function checkAuth() {
  const { data } = await client.auth.getSession();
  if (!data.session) {
    window.location.replace("login.html");
  }
}

// 👤 LOAD USER
async function loadUser() {
  const user = await getCurrentUser();
  updateUserUI(user);
}

// 📦 LOAD PRODUCTS (FIXED)
async function loadProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session) return;

  const { data, error } = await getProducts();

  if (error) {
    console.error(error);
    list.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
    return;
  }

  allProducts = data || [];

  renderProductsUI(allProducts);

  let total = 0;
  allProducts.forEach(p => {
    total += p.price * p.quantity;
  });

  document.getElementById("totalValue").innerText = total;
}

// ➕ ADD PRODUCT (FIXED)
async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  if (!name || !price || !quantity) {
    alert("Fill all fields");
    return;
  }

  const { error } = await addProductAPI({ name, price, quantity });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";

  await loadProducts(); // 🔥 FORCE REFRESH
}

// ✏️ EDIT
function editProduct(id, n, p, q) {
  editingId = id;

  document.getElementById("name").value = n;
  document.getElementById("price").value = p;
  document.getElementById("quantity").value = q;

  document.getElementById("addBtn").classList.add("hidden");
  document.getElementById("updateBtn").classList.remove("hidden");
}

// 🔄 UPDATE
async function updateProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  await updateProductAPI(editingId, { name, price, quantity });

  document.getElementById("addBtn").classList.remove("hidden");
  document.getElementById("updateBtn").classList.add("hidden");

  await loadProducts();
}

// ❌ DELETE
async function deleteProduct(id) {
  if (confirm("Delete this item?")) {
    await deleteProductAPI(id);
    await loadProducts();
  }
}

// 🔍 SEARCH
function filterProducts() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search)
  );

  renderProductsUI(filtered);
}

// 🚀 START (VERY IMPORTANT)
(async () => {
  await waitForSession();   // 🔥 FIXES DATA BUG
  await checkAuth();
  await loadUser();
  await loadProducts();
})();