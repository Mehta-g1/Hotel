# Hotel Ordering System

This Django-based Hotel Ordering System is currently **under active development**. It aims to streamline hotel operations such as dish ordering, billing, cashier shift management, and administration. The project is designed for educational purposes and is not yet production-ready.

> **Note:** The Django admin panel is included temporarily for management convenience and will be removed in future releases.

## Project Structure

- **Act/**: Handles activities and events related to hotel operations, such as tracking actions performed by staff.
- **Admin/**: Manages administrative functionalities, including user roles, permissions, and system configurations.
- **Billing/**: Manages billing processes, cashier operations, and bill items. Handles payment workflows and shift tracking.
- **Hotel/**: Contains core project settings, URL routing, and WSGI/ASGI configuration for deployment.
- **Order/**: Manages dishes, categories, and the ordering logic. Supports menu management and order processing.
- **db.sqlite3**: Default SQLite database file for local development and testing.

## Features

- **Order Management**: Add, update, and manage dishes and categories. Supports menu customization and real-time order tracking.
- **Billing**: Generate bills, manage bill items, and handle cashier shifts. Includes payment processing and receipt generation.
- **Admin Panel**: Integrated with Django admin for easy management of users, menu items, and hotel operations. *(Temporary; will be removed in future versions.)*
- **Shift Management**: Assign, track, and manage cashier shifts to ensure smooth operation and accountability.
- **Extensible Architecture**: Modular design allows for easy addition of new features and customization.

## Setup Instructions

1. **Clone the repository**
    ```sh
    git clone https://github.com/Mehta-g1/Hotel.git
    ```

2. **Install dependencies**
    ```sh
    pip install -r requirements.txt
    ```

3. **Apply migrations**
    ```sh
    python manage.py migrate
    ```

4. **Create a superuser (optional, for admin access)**
    ```sh
    python manage.py createsuperuser
    ```

5. **Run the development server**
    ```sh
    python manage.py runserver
    ```

6. **Access the application**
    - Main site: `http://127.0.0.1:8000/`
    - Admin panel: `http://127.0.0.1:8000/admin/` *(Temporary)*

## Requirements

- Python 3.10 or higher
- Django 5.2.5
- Additional dependencies listed in `requirements.txt`

## Database

- Default: SQLite (`db.sqlite3`) for local development.
- Database settings can be customized in [Hotel/settings.py](Hotel/settings.py) to use PostgreSQL, MySQL, or other supported backends.

## License

This project is provided for educational purposes and is not intended for commercial use.

## Contact

For questions, feedback, or support, please open an issue on the repository or contact the project maintainers.
