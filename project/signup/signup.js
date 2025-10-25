// === Works with your existing IDs (signUpName, signUpEmail, signUpPassword, termsCheckbox) ===

const form = document.getElementById("signupForm");

function hideAllErrors() {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    const msg = input.nextElementSibling;
    if (msg && msg.tagName === "SMALL") msg.classList.add("d-none");
    input.classList.remove("is-invalid");
  });
  const termsMsg = document.getElementById("termsError");
  if (termsMsg) termsMsg.classList.add("d-none");
}

function showError(inputEl, text) {
  const msg = inputEl.nextElementSibling;
  if (msg && msg.tagName === "SMALL") {
    msg.textContent = text;
    msg.classList.remove("d-none");
  }
  inputEl.classList.add("is-invalid");
}

function validEmail(v) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(v);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(arr) {
  localStorage.setItem("users", JSON.stringify(arr));
}
function emailExists(email) {
  const lower = email.toLowerCase();
  return getUsers().some((u) => (u.email || "").toLowerCase() === lower);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    hideAllErrors();

    const fullname = document.getElementById("signUpName");
    const email = document.getElementById("signUpEmail");
    const password = document.getElementById("signUpPassword");
    const terms = document.getElementById("termsCheckbox");
    const btn = form.querySelector(".sign-btn");

    let isValid = true;

    // Fullname
    if (fullname.value.trim().length < 3) {
      showError(fullname, "Full name must be at least 3 characters.");
      isValid = false;
    }

    // Email
    if (!validEmail(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    }

    // Password
    if (password.value.trim().length < 8) {
      showError(password, "Password must be at least 8 characters.");
      isValid = false;
    }

    // Terms
    if (!terms.checked) {
      const termsMsg = document.getElementById("termsError");
      if (termsMsg) termsMsg.classList.remove("d-none");
      isValid = false;
    }

    if (!isValid) return;

    // Email duplicate check
    if (emailExists(email.value.trim())) {
      showError(email, "Email already registered.");
      return;
    }

    // Save to localStorage
    const users = getUsers();
    users.push({
      name: fullname.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(), // demo only (plaintext)
    });
    saveUsers(users);

    // Success feedback on button + redirect
    if (btn) {
      btn.textContent = "Account Created!";
      btn.style.background = "#28a745";
    }

    // optional: SweetAlert2 confirmation (uncomment if you included the CDN)
    /*
    Swal.fire({
      title: "Account Created 🎉",
      text: "Welcome aboard, " + fullname.value.trim() + "!",
      icon: "success",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#000"
    }).then(() => {
      window.location.href = "../login/login.html";
    });
    return;
    */

    // Simple redirect after 1.5s
    setTimeout(() => (window.location.href = "../login/login.html"), 1500);
  });

  // live clearing: typing removes the error
  ["signUpName", "signUpEmail", "signUpPassword"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      const msg = el.nextElementSibling;
      if (msg && msg.tagName === "SMALL") msg.classList.add("d-none");
      el.classList.remove("is-invalid");
    });
  });

  // live clearing: ticking terms removes its message
  const terms = document.getElementById("termsCheckbox");
  terms.addEventListener("change", () => {
    const termsMsg = document.getElementById("termsError");
    if (termsMsg) termsMsg.classList.add("d-none");
  });
}
