function renderProductsUI(products) {
  const list = document.getElementById("productList");

  if (!products.length) {
    list.innerHTML = "<tr><td colspan='4'>No products found</td></tr>";
    return;
  }

  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <tr class="border-b border-slate-700">
        <td class="p-2">${p.name}</td>
        <td class="p-2">₹${p.price}</td>
        <td class="p-2">${p.quantity}</td>
        <td class="p-2 space-x-2">
          <button onclick="editProduct('${p.id}','${p.name}','${p.price}','${p.quantity}')"
            class="bg-blue-500 px-3 py-1 rounded">Edit</button>
          <button onclick="deleteProduct('${p.id}')"
            class="bg-red-500 px-3 py-1 rounded">Delete</button>
        </td>
      </tr>
    `;
  });
}

// 👤 USER UI
function updateUserUI(user) {
  if (!user) return;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email;

  const avatar =
    user.user_metadata?.avatar_url ||
    "https://i.pravatar.cc/40";

  document.getElementById("username").innerText = name;
  document.getElementById("avatar").src = avatar;
}