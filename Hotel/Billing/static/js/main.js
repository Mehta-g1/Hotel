
let dishes = document.querySelector(".invisible").innerHTML
function convertToArray(str) {
    // step 1: single quotes ko double quotes me badalna
    let jsonStr = str.replace(/'/g, '"');

    // step 2: parse karke array banana
    let arr = JSON.parse(jsonStr);

    return arr;
}

dishes = convertToArray(dishes)
console.log(typeof(dishes))
console.log(dishes)

let cart = {};

// Render Dishes
function renderDishes(filter = "") {
    const container = document.getElementById("dishContainer");
    container.innerHTML = "";

    let filtered;

    if (filter.trim() === "") {
        filtered = dishes;
    } else if (!isNaN(filter)) {
        // Agar number hai → exact match by parseInt
        filtered = dishes.filter(d => d.id === parseInt(filter));
    } else {
        // Agar text hai → name me search
        filtered = dishes.filter(d =>
            d.name.toLowerCase().includes(filter.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-danger">❌ No dishes found</p>`;
        return;
    }
    filtered.forEach(dish => {
        container.innerHTML += `
      <div class="col-md-6">
        <div class="card menu-card shadow-sm p-2">
          <div class="card-body">
            <h5>${dish.id}. ${dish.name}</h5>
            <p>${dish.description}</p>
            <h6>₹${dish.price}</h6>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${dish.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    });
}

// Enter key ka fix
document.getElementById("searchBox").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const filter = e.target.value.trim();
        let filtered;

        if (!isNaN(filter)) {
            // Number → exact id match (parseInt)
            filtered = dishes.filter(d => d.id === parseInt(filter));
        } else {
            // Text → name search
            filtered = dishes.filter(d =>
                d.name.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (filtered.length === 1) {
            addToCart(filtered[0].id);
            e.target.value = "";
            renderDishes();
        }
    }
});







// Add to Cart
function addToCart(id) {
    const dish = dishes.find(d => d.id === id);
    if (!cart[id]) {
        cart[id] = { ...dish, qty: 1 };
    } else {
        cart[id].qty++;
    }
    renderCart();
}

// Remove from Cart
function removeFromCart(id) {
    if (cart[id]) {
        cart[id].qty--;
        if (cart[id].qty <= 0) delete cart[id];
    }
    renderCart();
}

// Render Cart
function renderCart() {
    const cartTable = document.getElementById("cartTable");
    cartTable.innerHTML = "";
    let total = 0;

    for (let key in cart) {
        const item = cart[key];
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        cartTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          ${item.qty}
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">-</button>
        </td>
        <td>₹${itemTotal}</td>
      </tr>
    `;
    }

    if (Object.keys(cart).length === 0) {
        cartTable.innerHTML = `<tr><td colspan="4">No items added yet.</td></tr>`;
    }

    const tax = total * 0.05;
    const payable = total + tax;

    document.getElementById("totalAmount").innerText = total.toFixed(2);
    document.getElementById("taxAmount").innerText = tax.toFixed(2);
    document.getElementById("payableAmount").innerText = payable.toFixed(2);
}

// Search box functionality
document.getElementById("searchBox").addEventListener("input", e => {
    renderDishes(e.target.value);
});

document.getElementById("searchBox").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const filter = e.target.value;
        const filtered = dishes.filter(d =>
            d.name.toLowerCase().includes(filter.toLowerCase()) ||
            d.id.toString().includes(filter)
        );

        if (filtered.length === 1) {
            addToCart(filtered[0].id);
            e.target.value = "";
            renderDishes();
        }
    }
});

// Bill Date
document.getElementById("billDate").innerText = "Date: " + new Date().toLocaleString();

// Init
renderDishes();

// Populate datalist
function populateSearchSuggestions() {
    const datalist = document.getElementById("search-suggestions");
    dishes.forEach(dish => {
        const option = document.createElement('option');
        option.value = dish.name;
        datalist.appendChild(option);
    });
}
populateSearchSuggestions();

// Auto focus search bar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBox").focus();
});

// Suggestions dropdown
const searchBox = document.getElementById("searchBox");
const suggestionsBox = document.getElementById("suggestions");
const dishNames = dishes.map(d => d.name);

let currentIndex = -1; // track arrow selection

searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    currentIndex = -1;

    if (query.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    const filtered = dishNames.filter(name => name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-danger">❌ No dishes found</p>`;
        return;
    }
    filtered.forEach((name, index) => {
        const option = document.createElement("a");
        option.classList.add("list-group-item", "list-group-item-action");
        option.textContent = name;

        option.onclick = () => {
            searchBox.value = name;
            suggestionsBox.style.display = "none";
            renderDishes(name);
        };

        suggestionsBox.appendChild(option);
    });

    suggestionsBox.style.display = "block";
    suggestionsBox.style.width = searchBox.offsetWidth + "px";
});

// Keyboard navigation
searchBox.addEventListener("keydown", function (e) {
    const options = suggestionsBox.getElementsByTagName("a");
    if (options.length === 0) return;

    if (e.key === "ArrowDown") {
        // नीचे जाएं
        e.preventDefault();
        currentIndex = (currentIndex + 1) % options.length;
        highlightOption(options);
    } else if (e.key === "ArrowUp") {
        // ऊपर जाएं
        e.preventDefault();
        currentIndex = (currentIndex - 1 + options.length) % options.length;
        highlightOption(options);
    } else if (e.key === "Enter") {
        // Select करें
        e.preventDefault();
        if (currentIndex >= 0 && options[currentIndex]) {
            searchBox.value = options[currentIndex].textContent;
            suggestionsBox.style.display = "none";
            renderDishes(searchBox.value);
        }
    }
});

function highlightOption(options) {
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("active-option");
    }
    if (currentIndex >= 0) {
        options[currentIndex].classList.add("active-option");
    }
}

// Green highlight ke liye CSS add karo
const style = document.createElement("style");
style.innerHTML = `
  .active-option {
    background-color: green !important;
    color: white !important;
  }
`;
document.head.appendChild(style);




    let menuBtn = document.getElementById("menu-btn");
    let sidebar = document.getElementById("sidebar");
    let content = document.getElementById("content");

    menuBtn.onclick = function() {
      sidebar.classList.toggle("active");
      content.classList.toggle("active");
    }