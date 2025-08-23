
// const dishes = [
//     { id: 1, name: "Paneer Butter Masala", description: "Creamy paneer curry", price: 250, category: "Main Course" },
//     { id: 2, name: "Veg Biryani", description: "Fragrant rice with veggies", price: 180, category: "Rice" },
//     { id: 3, name: "Chicken Biryani", description: "Hyderabadi style chicken rice", price: 220, category: "Rice" },
//     { id: 4, name: "Dal Tadka", description: "Yellow dal with tadka", price: 150, category: "Main Course" },
//     { id: 5, name: "Chole Bhature", description: "Spicy chana with bhature", price: 120, category: "Snacks" },
//     { id: 6, name: "Aloo Paratha", description: "Stuffed paratha with butter", price: 90, category: "Breakfast" },
//     { id: 7, name: "Masala Dosa", description: "Crispy dosa with masala", price: 110, category: "South Indian" },
//     { id: 8, name: "Idli Sambhar", description: "Soft idli with sambhar", price: 80, category: "South Indian" },
//     { id: 9, name: "Pav Bhaji", description: "Mumbai style bhaji with pav", price: 100, category: "Snacks" },
//     { id: 10, name: "Rajma Chawal", description: "Punjabi rajma with rice", price: 140, category: "Main Course" },
//     { id: 11, name: "Mutton Curry", description: "Spicy mutton curry", price: 300, category: "Main Course" },
//     { id: 12, name: "Butter Naan", description: "Soft naan with butter", price: 50, category: "Bread" },
//     { id: 13, name: "Garlic Naan", description: "Garlic flavored naan", price: 60, category: "Bread" },
//     { id: 14, name: "Tandoori Roti", description: "Clay oven roti", price: 20, category: "Bread" },
//     { id: 15, name: "Mix Veg Curry", description: "Seasonal veg curry", price: 180, category: "Main Course" },
//     { id: 16, name: "Palak Paneer", description: "Spinach with paneer", price: 210, category: "Main Course" },
//     { id: 17, name: "Kadhai Paneer", description: "Paneer with capsicum", price: 220, category: "Main Course" },
//     { id: 18, name: "Shahi Paneer", description: "Rich creamy paneer curry", price: 230, category: "Main Course" },
//     { id: 19, name: "Veg Momos", description: "Steamed dumplings", price: 90, category: "Snacks" },
//     { id: 20, name: "Chicken Momos", description: "Steamed chicken dumplings", price: 120, category: "Snacks" },
//     { id: 21, name: "Spring Roll", description: "Crispy veg roll", price: 100, category: "Snacks" },
//     { id: 22, name: "Fried Rice", description: "Chinese style rice", price: 130, category: "Chinese" },
//     { id: 23, name: "Veg Manchurian", description: "Gravy manchurian", price: 150, category: "Chinese" },
//     { id: 24, name: "Chilli Paneer", description: "Spicy paneer cubes", price: 170, category: "Chinese" },
//     { id: 25, name: "Hakka Noodles", description: "Stir fried noodles", price: 140, category: "Chinese" },
//     { id: 26, name: "Paneer Tikka", description: "Grilled paneer", price: 200, category: "Starter" },
//     { id: 27, name: "Chicken Tikka", description: "Grilled chicken", price: 250, category: "Starter" },
//     { id: 28, name: "Fish Fry", description: "Crispy fried fish", price: 280, category: "Starter" },
//     { id: 29, name: "Veg Sandwich", description: "Grilled veg sandwich", price: 80, category: "Snacks" },
//     { id: 30, name: "Cheese Burger", description: "Cheese loaded burger", price: 150, category: "Snacks" },
//     { id: 31, name: "French Fries", description: "Crispy potato fries", price: 90, category: "Snacks" },
//     { id: 32, name: "Cold Coffee", description: "Icy coffee drink", price: 100, category: "Beverage" },
//     { id: 33, name: "Masala Chai", description: "Spiced Indian tea", price: 30, category: "Beverage" },
//     { id: 34, name: "Fresh Lime Soda", description: "Refreshing soda", price: 50, category: "Beverage" },
//     { id: 35, name: "Lassi", description: "Sweet Punjabi lassi", price: 70, category: "Beverage" },
//     { id: 36, name: "Gulab Jamun", description: "Sweet dessert", price: 60, category: "Dessert" },
//     { id: 37, name: "Rasgulla", description: "Bengali sweet", price: 50, category: "Dessert" },
//     { id: 38, name: "Kheer", description: "Rice pudding", price: 80, category: "Dessert" },
//     { id: 39, name: "Jalebi", description: "Crispy jalebi", price: 70, category: "Dessert" },
//     { id: 40, name: "Ice Cream", description: "Vanilla scoop", price: 100, category: "Dessert" },
//     { id: 41, name: "Paneer Pakora", description: "Crispy fried paneer", price: 120, category: "Snacks" },
//     { id: 42, name: "Samosa", description: "Stuffed samosa", price: 20, category: "Snacks" },
//     { id: 43, name: "Kachori", description: "Spicy kachori", price: 30, category: "Snacks" },
//     { id: 44, name: "Veg Pizza", description: "Cheesy veg pizza", price: 200, category: "Italian" },
//     { id: 45, name: "Margherita Pizza", description: "Classic pizza", price: 180, category: "Italian" },
//     { id: 46, name: "Chicken Pizza", description: "Loaded chicken pizza", price: 250, category: "Italian" },
//     { id: 47, name: "Pasta Alfredo", description: "Creamy pasta", price: 220, category: "Italian" },
//     { id: 48, name: "Pasta Arrabbiata", description: "Spicy pasta", price: 210, category: "Italian" },
//     { id: 49, name: "Club Sandwich", description: "Triple layer sandwich", price: 140, category: "Snacks" },
//     { id: 50, name: "Veg Soup", description: "Healthy veg soup", price: 100, category: "Starter" },
// ];

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