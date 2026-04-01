let editingId = null;

async function fetchProducts() {
  const { data } = await getProducts();

  const table = document.getElementById("tableBody");
  table.innerHTML = "";

  data.forEach(item => {
    table.innerHTML += `
      <tr class="border-b border-slate-700">
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>
          <button onclick="editProduct(${item.id}, '${item.name}', ${item.price}, ${item.quantity})" class="bg-blue-500 px-2 py-1 rounded">Edit</button>
          <button onclick="deleteProduct(${item.id})" class="bg-red-500 px-2 py-1 rounded">Delete</button>
        </td>
      </tr>
    `;
  });

  calculateTotal(data);
}

async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  if (editingId) {
    await updateProductAPI(editingId, { name, price, quantity });
    editingId = null;
  } else {
    await addProductAPI({ name, price, quantity });
  }

  clearInputs();
  fetchProducts();
}

async function deleteProduct(id) {
  await deleteProductAPI(id);
  fetchProducts();
}

function editProduct(id, name, price, quantity) {
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("quantity").value = quantity;

  editingId = id;
}

function calculateTotal(data) {
  let total = 0;
  data.forEach(item => total += item.price * item.quantity);
  document.getElementById("totalValue").innerText = "₹" + total;
}

function searchProduct() {
  const value = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(value) ? "" : "none";
  });
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
}

fetchProducts();