# 🏨 Hotel Ordering & Billing (POS) System

A modern, real-time POS (Point of Sale) ordering and billing system built using **Django 5.2** and **Django Channels (WebSockets)**. This application provides hotel cashiers with a dynamic interface to take orders, generate bills, and manage receipts in real time, while granting administrators granular control over cashier shifts, menu items, bill auditing, and comprehensive sales analytics.

---

## 🏗️ System Architecture & Modular Design

The project is structured as a modular Django application split into four feature-focused apps:

```
Hotel-Ordering/
├── requirements.txt         # Project-wide dependencies
├── Readme.md                # Project documentation
├── images/                  # Mockups & assets
└── Hotel/                   # Django Project Root
    ├── manage.py            # Django CLI entry point
    ├── db.sqlite3           # Local development database
    ├── templates/           # Global templates folder
    │   ├── Act/             # Static pages templates
    │   ├── admin_app/       # Administration dashboards
    │   ├── billing/         # Cashier desk & billing templates
    │   └── order/           # Dish management templates
    ├── static/              # Global static files
    │   ├── Act/             # Styles/assets for public pages
    │   └── Billing/         # Stylesheets & Javascript for POS
    │       ├── css/
    │       └── js/
    │           ├── main.js  # Client-side POS state engine
    │           └── dish.js  
    │
    │   --- Core Apps ---
    ├── Hotel/               # Main project configurations (settings, urls, asgi, wsgi)
    ├── Act/                 # Public portal, static pages (About, Contact, Home)
    ├── Admin/               # Superuser dashboard, cashier CRUD, bill auditing & analytics
    ├── Billing/             # Cashier operations, WebSocket consumers, billing reports
    └── Order/               # Dish & Category catalog management
```

### 📦 Applications Overview

1. **`Hotel` (Core Configuration)**: Coordinates project-wide settings, URL routers, and imports the ASGI protocol router to split HTTP traffic and WebSocket connections via Django Channels/Daphne.
2. **`Billing` (POS Operations)**: Uses Django Channels sync and async consumers to manage WebSocket connections. Cashiers connect to a WebSocket endpoint (`ws/sc/`) to fetch live dishes and submit orders. It handles cashier shifts, bill item records, and cashier session-based login.
3. **`Admin` (Management & Analytics)**: Provides a portal reserved for superusers (`is_superuser`) containing cashiers management (CRUD), bill audits (edit items, adjust quantities, calculate taxes), and automated approval/rejection of cashiers' billing modification requests.
4. **`Order` (Menu Catalog)**: Manages dishes, pricing, recipe details, category routing, and dish availability. Restricts write operations (create, update, delete) to administrators.
5. **`Act` (Marketing & Public Pages)**: Handles default routes, company overview, dashboard entry points, and contact forms.

---

## ✨ Features

### 💻 Real-Time POS Cashier Workspace
* **WebSocket-Driven Catalog**: Instant, async loading of dishes on load via `ws://127.0.0.1:8000/ws/sc/`.
* **Search-as-you-type Suggestions**: Search dishes by Name, ID, or Category instantly.
* **Interactive Cart Engine**: Easily increment, decrement, and remove items with real-time tax (5% via WS, 18% via Checkout) and grand total calculations.
* **Cashier Shift Management**: Support for assigning cashiers to `Day` or `Night` shifts.
* **Keyboard Hotkeys**:
  * `F2` to submit the bill and trigger cashier payment.
  * `Enter` (inside receipt view) to print the receipt using native browser settings.
  * `Escape` (inside receipt view) to discard the bill and return to the ordering layout.

### 📊 Administrative Tools & Analytics
* **Cashier Management**: Full CRUD capabilities to onboard, update profiles, and offboard cashier accounts.
* **Sales Analytics Dashboard**:
  * **Revenue tracking**: Displays total revenue and order volume.
  * **Cashier Performance**: Charts sales volume per cashier.
  * **Item Performance**: Highlights top-selling and least-selling dishes and categories.
  * **Cross-Analysis breakdown**: Views which cashier sells what items most frequently.
* **Bill Auditing & Modification Workflow**:
  * Cashiers can request changes or deletions on closed bills.
  * Admins approve or reject modifications from the control panel.
  * Admins can directly add/remove dishes or edit quantities on existing bills.

---

## 🛠️ Tech Stack

* **Backend**: Django 5.2.5, Django Channels 4.3.1 (ASGI Protocol Layer)
* **Server**: Daphne 4.2.1 (ASGI Development Server)
* **Database**: SQLite (default local db file)
* **Frontend**: HTML5, Vanilla CSS, Bootstrap, Vanilla Javascript (OOP design)

---

## 🚀 Setup & Installation Instructions

Follow these steps to run the Hotel Ordering System locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Mehta-g1/Hotel.git
cd Hotel
```

### 2. Configure the Python Virtual Environment
Create and activate a virtual environment to manage dependencies:
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
Install all package requirements listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 4. Run Migrations
Apply database migrations to set up the default SQLite database:
```bash
# Navigate to the Django project root (where manage.py is located)
cd Hotel
python manage.py migrate
```

### 5. Create a Superuser
Create an administrator account to access the Django Admin and Superuser Analytics panel:
```bash
python manage.py createsuperuser
```

### 6. Run the Daphne Development Server
Start the server using Daphne (which handles both HTTP and WebSocket traffic):
```bash
python manage.py runserver
```

---

## 🔗 Endpoint Routing Directory

| URL Endpoint | App/View | User Permissions | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Act_views.Home` | Public | Main landing/splash page |
| `/login/` | `Billing_views.Login` | Cashiers / Admins | Session-based unified login screen |
| `/billing/` | `Billing.views.Home` | Cashier Session | POS Cashier interface (Ordering board) |
| `/billing/reports/` | `Billing.views.Reports` | Cashier Session | View cashier's sales history (filters: today, week, month) |
| `/admin_app/dashboard/` | `Admin.views.admin_dashboard` | Super Admin | Overview of overall revenue, order counts, cashier count |
| `/admin_app/analytics/` | `Admin.views.analytics` | Super Admin | Core performance tracking & breakdowns |
| `/admin_app/bills/` | `Admin.views.manage_bills` | Super Admin | Audit bills & review cashier modification requests |
| `/order/dishes/` | `Order.views.dishes` | Cashier / Admin | View and manage available dishes |
| `/admin/` | Django Admin | Django Superuser | Low-level database management |

---

## 🔒 License & Usage
This project is built for educational purposes. All rights reserved.
