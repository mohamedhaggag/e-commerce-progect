(function () {
  const form = document.querySelector(".signinForm");
  if (!form) return;

  const emailInput = document.getElementById("signInEmail");
  const passwordInput = document.getElementById("signInPassword");
  const loginError = document.getElementById("loginError");

  function showTopError(msg = "Invalid email or password.") {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.classList.remove("d-none");
  }

  function hideTopError() {
    if (loginError) loginError.classList.add("d-none");
  }

  function clearFieldError(inputEl) {
    inputEl.classList.remove("is-invalid");
    const fb = inputEl.nextElementSibling;
    if (fb && fb.classList.contains("invalid-feedback")) fb.textContent = "";
  }

  [emailInput, passwordInput].forEach((el) => {
    el.addEventListener("input", () => hideTopError());
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    hideTopError();

    const email = emailInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();

    if (!email || !pass) {
      showTopError("Please enter both email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) =>
        (u.email || "").toLowerCase() === email && (u.password || "") === pass
    );

    if (!user) {
      showTopError("Invalid email or password.");
      return;
    }

    // ✅ Mark user as logged in
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: user.name || user.fullname || "", email })
    );

    // ✅ Redirect immediately to home page
    window.location.href = "../index.html";
  });
})();
