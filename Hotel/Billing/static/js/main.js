const ws = new WebSocket('ws://127.0.0.1:8000/ws/sc/');

ws.onopen = function () {
    console.log("WebSocket Connection Open ...");
    ws.send("send dishes");
}

let dishes = []; // global dishes array
let cart = {};

ws.onmessage = function (event) {
    try {
        let data = JSON.parse(event.data); // ✅ server se aaya data JSON parse karo
        console.log("Message Received from server ....", data);

        // Agar data dishes ka object hai to usko array me badlo
        dishes = data

        // Server se data aate hi dishes ko render karo
        renderDishes();

        
    } catch (e) {
        console.error("Error parsing server data:", e, event.data);
    }
}

ws.onerror = function (event) {
    console.log("WebSocket Error Occurred ....", event);
}

ws.onclose = function (event) {
    console.log("WebSocket connection closed ...", event);
}


// Render Dishes
function renderDishes(dishesToRender = dishes) {
    const container = document.getElementById("dishContainer");
    container.innerHTML = "";

    if (dishesToRender.length === 0) {
        container.innerHTML = `<p class="text-danger">❌ No dishes found</p>`;
        return;
    }
    dishesToRender.forEach(dish => {
        container.innerHTML += `
      <div class="col-md-6 ">
        <div class="card menu-card shadow-sm p-2 dish-card">
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



function renderCart() {
    const cartTable = document.getElementById("cartTable");
    cartTable.innerHTML = "";
    let total = 0;
    let i = 0;

    for (let key in cart) {
        const item = cart[key];
        const itemTotal = item.price * item.qty; // per item total
        total += itemTotal;

        cartTable.innerHTML += `
          <tr>
            <td><input type="number" value="${++i}" readonly class="form-control"/></td>
            <input style="display:none;" type="text" name="id[${i}]" value="${item.id}">
            <td style="width:40%;"><input type="text" style="font-weight:bold;" name="item_name[${i}]" value="${item.name}" readonly class="form-control"/></td>
            <td><input type="text" name="item_price" value="₹${item.price}" readonly class="form-control"/></td>
            <td class="d-flex align-items-center justify-content-center">
                <button type="button" class="btn btn-sm btn-danger me-2" onclick="removeFromCart(${item.id})" >-</button>
                <input type="text" name="item_qty[${i}]" value="${item.qty}" readonly class="form-control qty text-center" style="width: 50px;"/>
                <button type="button" class="btn btn-sm btn-success ms-2" onclick="addToCart(${item.id})">+</button>
            </td>
            <td><input type="text" name="item_total[]" value="₹${itemTotal}" readonly class="form-control"/></td>
          </tr>
        `;
    }

    if (Object.keys(cart).length === 0) {
        cartTable.innerHTML = "<tr><td colspan=\"5\">No items added yet.</td></tr>";
    }

    const tax = total * 0.05;
    const payable = total + tax;

    // Correct variable definitions
    let TotalAmount = total.toFixed(2);
    let TaxAmount = tax.toFixed(2);
    let PayableAmount = payable.toFixed(2);

    console.log("Total:", TotalAmount);
    console.log("Tax:", TaxAmount);
    console.log("Payable:", PayableAmount);
    console.log("-------------------------\n");

    // ye input ke value ko update karega
    document.getElementById("totalAmount").innerHTML = TotalAmount;
    document.getElementById("taxAmount").innerHTML = TaxAmount;
    document.getElementById("payableAmount").innerHTML =  PayableAmount;

}


// Bill Date
document.getElementById("billDate").innerText = "Date: " + new Date().toLocaleString();

// Init
renderDishes();


// Auto focus search bar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBox").focus();
});

const searchBox = document.getElementById("searchBox");
const suggestionsBox = document.getElementById("suggestions");
let currentIndex = -1;

searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";
    currentIndex = -1;

    if (query.length === 0) {
        suggestionsBox.style.display = "none";
        renderDishes(); // Show all dishes when search is cleared
        return;
    }

    const filteredDishes = dishes.filter(dish => {
        const dishName = dish.name.toLowerCase();
        // Make sure category exists and is a string before calling toLowerCase
        const dishCategory = (dish.category && typeof dish.category === 'string') ? dish.category.toLowerCase() : '';
        const dishId = dish.id.toString();
        return dishName.includes(query) || dishCategory.includes(query) || dishId.includes(query);
    });

    if (filteredDishes.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    filteredDishes.forEach(dish => {
        const suggestionItem = document.createElement("a");
        suggestionItem.classList.add("list-group-item", "list-group-item-action");
        suggestionItem.textContent = `${dish.name} (${dish.category}) - ₹${dish.price}`;
        suggestionItem.onclick = () => {
            addToCart(dish.id);
            searchBox.value = "";
            suggestionsBox.innerHTML = "";
            suggestionsBox.style.display = "none";
            renderDishes();
        };
        suggestionsBox.appendChild(suggestionItem);
    });

    suggestionsBox.style.display = "block";
    suggestionsBox.style.width = searchBox.offsetWidth + "px";
});

searchBox.addEventListener("keydown", function (e) {
    const suggestions = suggestionsBox.getElementsByTagName("a");
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex++;
        if (currentIndex >= suggestions.length) {
            currentIndex = 0;
        }
        highlightSuggestion(suggestions);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = suggestions.length - 1;
        }
        highlightSuggestion(suggestions);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex > -1) {
            suggestions[currentIndex].click();
        }
    }
});

function highlightSuggestion(suggestions) {
    for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].classList.remove("active-option");
    }
    if (currentIndex > -1) {
        suggestions[currentIndex].classList.add("active-option");
    }
}

// Green highlight ke liye CSS add karo
const style = document.createElement("style");
style.innerHTML = " 
  .active-option {
    background-color: green !important;
    color: white !important;
  }
";
document.head.appendChild(style);

// Hide suggestions when clicking outside
document.addEventListener("click", function(event) {
    if (!searchBox.contains(event.target)) {
        suggestionsBox.style.display = "none";
    }
});


let menuBtn = document.getElementById("menu-btn");
let sidebar = document.getElementById("sidebar");
let content = document.getElementById("content");

menuBtn.onclick = function () {
    sidebar.classList.toggle("active");
    content.classList.toggle("active");
}
