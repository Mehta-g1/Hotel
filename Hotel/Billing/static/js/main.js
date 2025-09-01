document.addEventListener("DOMContentLoaded", () => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/sc/');

    ws.onopen = function () {
        console.log("WebSocket Connection Open ...");
        ws.send("send dishes");
    }

    let dishes = []; // global dishes array
    let cart = {};

    ws.onmessage = function (event) {
        try {
            let data = JSON.parse(event.data);
            console.log("Message Received from server ....", data);
            dishes = data;
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

    function renderDishes(dishesToRender = dishes) {
        const container = document.getElementById("dishContainer");
        if (!container) return;
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

    window.addToCart = function(id) {
        const dish = dishes.find(d => d.id === id);
        if (!cart[id]) {
            cart[id] = { ...dish, qty: 1 };
        } else {
            cart[id].qty++;
        }
        renderCart();
    }

    window.removeFromCart = function(id) {
        if (cart[id]) {
            cart[id].qty--;
            if (cart[id].qty <= 0) delete cart[id];
        }
        renderCart();
    }

    function renderCart() {
        const cartTable = document.getElementById("cartTable");
        if(!cartTable) return;
        cartTable.innerHTML = "";
        let total = 0;
        let i = 0;
        let hiddenInputsHTML = '';

        for (let key in cart) {
            const item = cart[key];
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            i++;

            cartTable.innerHTML += `
              <tr>
                <td>${i}</td>
                <td style="width:40%; font-weight:bold;">${item.name}</td>
                <td>₹${item.price}</td>
                <td class="d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn-md btn-danger me-2" onclick="removeFromCart(${item.id})">-</button>
                    <span class="qty text-center" style="width: 50px;">${item.qty}</span>
                    <button type="button" class="btn btn-md btn-success ms-2" onclick="addToCart(${item.id})">+</button>
                </td>
                <td>₹${itemTotal.toFixed(2)}</td>
              </tr>
            `;
            hiddenInputsHTML += `
                <input type="hidden" name="id[${i}]" value="${item.id}">
                <input type="hidden" name="item_name[${i}]" value="${item.name}">
                <input type="hidden" name="item_qty[${i}]" value="${item.qty}">
            `;
        }

        let hiddenInputsContainer = document.getElementById('hidden-inputs-container');
        if (!hiddenInputsContainer) {
            hiddenInputsContainer = document.createElement('div');
            hiddenInputsContainer.id = 'hidden-inputs-container';
            const form = document.querySelector('form');
            if(form) form.appendChild(hiddenInputsContainer);
        }
        hiddenInputsContainer.innerHTML = hiddenInputsHTML;


        if (Object.keys(cart).length === 0) {
            cartTable.innerHTML = `<tr><td colspan="5" class="text-muted p-3">No items added yet.</td></tr>`;
        }

        const tax = total * 0.05;
        const payable = total + tax;

        let TotalAmount = total.toFixed(2);
        let TaxAmount = tax.toFixed(2);
        let PayableAmount = payable.toFixed(2);

        const totalAmountEl = document.getElementById("totalAmount");
        const taxAmountEl = document.getElementById("taxAmount");
        const payableAmountEl = document.getElementById("payableAmount");

        if(totalAmountEl) totalAmountEl.innerHTML = TotalAmount;
        if(taxAmountEl) taxAmountEl.innerHTML = TaxAmount;
        if(payableAmountEl) payableAmountEl.innerHTML = PayableAmount;
    }

    const billDateEl = document.getElementById("billDate");
    if(billDateEl) billDateEl.innerText = "Date: " + new Date().toLocaleString();

    renderDishes();

    const searchBox = document.getElementById("searchBox");
    if(searchBox) searchBox.focus();
    
    const suggestionsBox = document.getElementById("suggestions");
    let currentIndex = -1;

    if(searchBox && suggestionsBox){
        searchBox.addEventListener("input", function () {
            const query = this.value.toLowerCase().trim();
            suggestionsBox.innerHTML = "";
            currentIndex = -1;

            if (query.length === 0) {
                suggestionsBox.style.display = "none";
                renderDishes();
                return;
            }

            const filteredDishes = dishes.filter(dish => {
                const dishName = dish.name.toLowerCase();
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
    }


    function highlightSuggestion(suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].classList.remove("active-option");
        }
        if (currentIndex > -1) {
            suggestions[currentIndex].classList.add("active-option");
        }
    }

    const style = document.createElement("style");
    style.innerHTML = ` 
      .active-option {
        background-color: green !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("click", function(event) {
        if (suggestionsBox && searchBox && !searchBox.contains(event.target)) {
            suggestionsBox.style.display = "none";
        }
    });

    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    if(menuBtn && sidebar && content){
        menuBtn.onclick = function () {
            sidebar.classList.toggle("active");
            content.classList.toggle("active");
        }
    }
});