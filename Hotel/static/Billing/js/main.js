// POS System - Single File Implementation

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.dishes = [];
        this.onDishesReceived = null;
        this.onBillReceived = null;
    }

    connect() {
        this.ws = new WebSocket('ws://127.0.0.1:8000/ws/sc/');

        this.ws.onopen = () => {
            console.log("WebSocket Connection Open");
            this.ws.send("send dishes");
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.messageType === "Dishes") {
                    console.log("Dishes received:", data);
                    this.dishes = data.message;
                    if (this.onDishesReceived) {
                        this.onDishesReceived(this.dishes);
                    }
                } else if (data.messageType === "SuccessMessage") {
                    console.log("Bill data received:", data.message);
                    if (this.onBillReceived) {
                        this.onBillReceived(data.message);
                    }
                }
            } catch (error) {
                console.error("Error parsing server data:", error, event.data);
            }
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.ws.onclose = () => {
            console.warn("WebSocket closed");
        };
    }

    sendBillData(billItems) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(billItems));
        }
    }

    getDishes() {
        return this.dishes;
    }
}

class CartManager {
    constructor() {
        this.cart = {};
        this.onCartUpdate = null;
    }

    addItem(dish) {
        if (!this.cart[dish.id]) {
            this.cart[dish.id] = { ...dish, qty: 1 };
        } else {
            this.cart[dish.id].qty++;
        }
        this.updateCart();
    }

    removeItem(id) {
        if (this.cart[id]) {
            this.cart[id].qty--;
            if (this.cart[id].qty <= 0) {
                delete this.cart[id];
            }
        }
        this.updateCart();
    }

    clearCart() {
        this.cart = {};
        this.updateCart();
    }

    getCart() {
        return this.cart;
    }

    getCartItems() {
        return Object.values(this.cart);
    }

    isEmpty() {
        return Object.keys(this.cart).length === 0;
    }

    getTotals() {
        let total = 0;
        for (let key in this.cart) {
            const item = this.cart[key];
            total += item.price * item.qty;
        }
        const tax = total * 0.05;
        const payable = total + tax;

        return {
            subtotal: total,
            tax: tax,
            total: payable
        };
    }

    updateCart() {
        if (this.onCartUpdate) {
            this.onCartUpdate();
        }
    }

    prepareBillData() {
        const billItems = [{ dataType: "Bill Details" }];
        
        for (let key in this.cart) {
            const item = this.cart[key];
            billItems.push({
                id: item.id,
                qty: item.qty
            });
        }

        return billItems;
    }
}

class DishesManager {
    constructor(cartManager) {
        this.dishes = [];
        this.cartManager = cartManager;
        this.currentSearchIndex = -1;
        this.setupEventListeners();
    }

    setDishes(dishes) {
        this.dishes = dishes;
        this.render();
    }

    render(dishesToRender = this.dishes) {
        const container = document.getElementById("dishContainer");
        if (!container) return;

        container.innerHTML = "";

        if (dishesToRender.length === 0) {
            container.innerHTML = `<p class="text-danger">❌ No dishes found</p>`;
            return;
        }

        dishesToRender.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.className = 'col-md-6';
            dishElement.innerHTML = `
                <div class="card menu-card shadow-sm p-2 dish-card">
                    <div class="card-body">
                        <h5>${dish.id}. ${dish.name}</h5>
                        <p>${dish.description}</p>
                        <h6>₹${dish.price}</h6>
                        <button class="btn btn-primary btn-sm add-to-cart-btn" data-dish-id="${dish.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;

            const addButton = dishElement.querySelector('.add-to-cart-btn');
            addButton.addEventListener('click', () => {
                this.cartManager.addItem(dish);
            });

            container.appendChild(dishElement);
        });
    }

    setupEventListeners() {
        const searchBox = document.getElementById("searchBox");
        const suggestionsBox = document.getElementById("suggestions");

        if (!searchBox || !suggestionsBox) return;

        searchBox.addEventListener("input", (e) => {
            this.handleSearch(e.target.value, suggestionsBox);
        });

        searchBox.addEventListener("keydown", (e) => {
            this.handleSearchKeys(e, suggestionsBox);
        });

        // Close suggestions when clicking outside
        document.addEventListener("click", (event) => {
            if (!searchBox.contains(event.target)) {
                suggestionsBox.style.display = "none";
            }
        });

        // Focus search box on page load
        searchBox.focus();
    }

    handleSearch(query, suggestionsBox) {
        query = query.toLowerCase().trim();
        suggestionsBox.innerHTML = "";
        this.currentSearchIndex = -1;

        if (query.length === 0) {
            suggestionsBox.style.display = "none";
            this.render();
            return;
        }

        const filteredDishes = this.dishes.filter(dish => {
            const dishName = dish.name.toLowerCase();
            const dishCategory = dish.category ? dish.category.toLowerCase() : '';
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
            suggestionItem.textContent = `${dish.name} (${dish.category || 'N/A'}) - ₹${dish.price}`;
            
            suggestionItem.addEventListener('click', () => {
                this.cartManager.addItem(dish);
                document.getElementById("searchBox").value = "";
                suggestionsBox.innerHTML = "";
                suggestionsBox.style.display = "none";
                this.render();
            });

            suggestionsBox.appendChild(suggestionItem);
        });

        suggestionsBox.style.display = "block";
        suggestionsBox.style.width = searchBox.offsetWidth + "px";
    }

    handleSearchKeys(e, suggestionsBox) {
        const suggestions = suggestionsBox.getElementsByTagName("a");
        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            this.currentSearchIndex++;
            if (this.currentSearchIndex >= suggestions.length) {
                this.currentSearchIndex = 0;
            }
            this.highlightSuggestion(suggestions);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            this.currentSearchIndex--;
            if (this.currentSearchIndex < 0) {
                this.currentSearchIndex = suggestions.length - 1;
            }
            this.highlightSuggestion(suggestions);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (this.currentSearchIndex > -1) {
                suggestions[this.currentSearchIndex].click();
            }
        }
    }

    highlightSuggestion(suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].classList.remove("active-option");
        }
        if (this.currentSearchIndex > -1) {
            suggestions[this.currentSearchIndex].classList.add("active-option");
        }
    }
}

class BillManager {
    constructor(cartManager) {
        this.cartManager = cartManager;
        this.isVisible = false;
        this.setupEventListeners();
    }

    render(billData) {
        console.log("Rendering bill");
        
        const billBox = document.querySelector('.bill');
        const billInfo = document.querySelector('.BillInfo');
        const content = document.querySelector('.content');

        if (!billData || !billData[0] || !billData[1]) {
            console.error("Invalid bill data");
            return;
        }

        const billDetails = billData[0];
        const items = billData[1];

        // Update bill details
        this.updateElement('#Cashiername', billDetails.cashier);
        this.updateElement('#Billno', billDetails.billNo);
        this.updateElement('.Subtotals', "₹" + billDetails.subtotal);
        this.updateElement('.totalss', "₹" + billDetails.total);
        this.updateElement('.ttl', "₹" + billDetails.taxAmount);

        // Show bill, hide content
        content.style.display = 'none';
        billBox.classList.add('bill-visible');
        this.isVisible = true;

        // Clear and populate bill items
        billInfo.innerHTML = "";
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.item}</td>
                <td>₹${item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price * item.quantity}</td>
            `;
            billInfo.appendChild(row);
        });

        // Add keyboard listener
        document.addEventListener('keydown', this.handleBillKeys);
    }

    updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = value;
        }
    }

    handleBillKeys = (e) => {
        if (!this.isVisible) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            window.print();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.goBack();
        }
        
    }

    goBack() {
        const content = document.querySelector('.content');
        const billBox = document.querySelector('.bill');
        
        billBox.classList.remove('bill-visible');
        content.style.display = 'block';
        this.isVisible = false;

        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleBillKeys);

        // Clear cart
        this.cartManager.clearCart();

        // Again focus on search Box
        const searchBox = document.getElementById("searchBox");
        searchBox.focus();
    }

    setupEventListeners() {
        const backButton = document.querySelector('.backbtn');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.goBack();
            });
        }
    }
}

class UIManager {
    constructor(cartManager) {
        this.cartManager = cartManager;
        this.setupEventListeners();
        this.setupStyles();
    }

    renderCart() {
        const cartTable = document.getElementById("cartTable");
        if (!cartTable) return;

        cartTable.innerHTML = "";
        const cart = this.cartManager.getCart();
        let index = 0;
        let hiddenInputsHTML = '';

        for (let key in cart) {
            const item = cart[key];
            const itemTotal = item.price * item.qty;
            index++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index}</td>
                <td style="width:40%; font-weight:bold;">${item.name}</td>
                <td>₹${item.price}</td>
                <td class="d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn-md btn-danger me-2 remove-btn" data-item-id="${item.id}">-</button>
                    <span class="qty text-center" style="width: 50px;">${item.qty}</span>
                    <button type="button" class="btn btn-md btn-success ms-2 add-btn" data-item-id="${item.id}">+</button>
                </td>
                <td>₹${itemTotal.toFixed(2)}</td>
            `;

            // Add event listeners to buttons
            const removeBtn = row.querySelector('.remove-btn');
            const addBtn = row.querySelector('.add-btn');
            
            removeBtn.addEventListener('click', () => {
                this.cartManager.removeItem(item.id);
            });
            
            addBtn.addEventListener('click', () => {
                this.cartManager.addItem(item);
            });

            cartTable.appendChild(row);

            hiddenInputsHTML += `
                <input class="id" type="hidden" name="id[${index}]" value="${item.id}">
                <input type="hidden" name="item_name[${index}]" value="${item.name}">
                <input class="qty1" type="hidden" name="item_qty[${index}]" value="${item.qty}">
            `;
        }

        // Update hidden inputs
        this.updateHiddenInputs(hiddenInputsHTML);

        // Show empty cart message if needed
        if (this.cartManager.isEmpty()) {
            cartTable.innerHTML = `<tr><td colspan="5" class="text-muted p-3">No items added yet.</td></tr>`;
        }

        // Update totals
        this.updateTotals();
    }

    updateHiddenInputs(hiddenInputsHTML) {
        let hiddenInputsContainer = document.getElementById('hidden-inputs-container');
        if (!hiddenInputsContainer) {
            hiddenInputsContainer = document.createElement('div');
            hiddenInputsContainer.id = 'hidden-inputs-container';
            const form = document.querySelector('form');
            if (form) {
                form.appendChild(hiddenInputsContainer);
            }
        }
        hiddenInputsContainer.innerHTML = hiddenInputsHTML;
    }

    updateTotals() {
        const totals = this.cartManager.getTotals();

        const totalAmountEl = document.getElementById("totalAmount");
        const taxAmountEl = document.getElementById("taxAmount");
        const payableAmountEl = document.getElementById("payableAmount");

        if (totalAmountEl) totalAmountEl.innerHTML = totals.subtotal.toFixed(2);
        if (taxAmountEl) taxAmountEl.innerHTML = totals.tax.toFixed(2);
        if (payableAmountEl) payableAmountEl.innerHTML = totals.total.toFixed(2);
    }

    setupEventListeners() {
        // Set bill date
        const billDateEl = document.getElementById("billDate");
        if (billDateEl) {
            billDateEl.innerText = new Date().toLocaleString();
        }

        // Setup sidebar toggle
        const menuBtn = document.getElementById("menu-btn");
        const sidebar = document.getElementById("sidebar");
        const content = document.getElementById("content");

        if (menuBtn && sidebar && content) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle("active");
                content.classList.toggle("active");
            });
        }

        // Setup F2 keyboard shortcut for quick payment
        document.addEventListener("keydown", (e) => {
            if (e.key === 'F2') {
                e.preventDefault();
                const payNowBtn = document.getElementById('payNowBtn');
                if (payNowBtn && !this.cartManager.isEmpty()) {
                    payNowBtn.click();
                }
            }
        });
    }

    setupStyles() {
        // Add custom styles for search suggestions
        const style = document.createElement("style");
        style.innerHTML = `
            .active-option {
                background-color: #198754 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    }
}

class POSApp {
    constructor() {
        this.wsManager = new WebSocketManager();
        this.cartManager = new CartManager();
        this.dishesManager = new DishesManager(this.cartManager);
        this.billManager = new BillManager(this.cartManager);
        this.uiManager = new UIManager(this.cartManager);

        this.init();
    }

    init() {
        // Setup WebSocket callbacks
        this.wsManager.onDishesReceived = (dishes) => {
            this.dishesManager.setDishes(dishes);
        };

        this.wsManager.onBillReceived = (billData) => {
            this.billManager.render(billData);
        };

        // Setup cart update callback
        this.cartManager.onCartUpdate = () => {
            this.uiManager.renderCart();
        };

        // Setup pay now button
        this.setupPayNowButton();

        // Connect to WebSocket
        this.wsManager.connect();

        // Initial cart render
        this.uiManager.renderCart();
    }

    setupPayNowButton() {
        const payNowBtn = document.getElementById("payNowBtn");
        if (payNowBtn) {
            payNowBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
    }

    processPayment() {
        if (this.cartManager.isEmpty()) {
            alert("Add items to cart first");
            return;
        }

        const billItems = this.cartManager.prepareBillData();
        console.log("Sending bill data:", billItems);
        this.wsManager.sendBillData(billItems);
    }
}


// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new POSApp();
});