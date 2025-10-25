const form = document.getElementById("productForm");
    const backBtn = document.getElementById("backBtn");
    const title = document.getElementById("formTitle");

    // get edit index from URL
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get("edit");

    // if editing, fill the form with product data
    if (editIndex !== null) {
        title.textContent = "Edit Product";
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products[editIndex];

        if (product) {
            document.getElementById("name").value = product.name;
            document.getElementById("category").value = product.category;
            document.getElementById("quantity").value = product.quantity;
            document.getElementById("price").value = product.price;
            document.getElementById("status").value = product.status;
        }
        }

        form.addEventListener("submit", (e) => {
        e.preventDefault();
        const products = JSON.parse(localStorage.getItem("products")) || [];
            // when i click to add
        const newProduct = {
            name: document.getElementById("name").value,
            category: document.getElementById("category").value,
            quantity: document.getElementById("quantity").value,
            price: document.getElementById("price").value,
            status: document.getElementById("status").value,
            createdAt: new Date().toISOString().split("T")[0],
        };

        if (editIndex !== null) {
            // update existing
            products[editIndex] = newProduct;
            alert("✅ Product Updated Successfully!");
        } else {
            // add new
            products.push(newProduct);
            alert("✅ Product Added Successfully!");
        }

        localStorage.setItem("products", JSON.stringify(products));
        window.location.href = "index.html";
        });

        backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
        });