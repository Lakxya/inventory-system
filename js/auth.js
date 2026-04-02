async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) alert(error.message);
  else window.location.href = "index.html";
}

async function googleLogin() {
  await client.auth.signInWithOAuth({ provider: "google" });
}

async function logout() {
  await client.auth.signOut();

  localStorage.clear();
  sessionStorage.clear();

  window.location.replace("login.html");
}