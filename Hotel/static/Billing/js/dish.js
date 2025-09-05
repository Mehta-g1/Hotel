
// UI Enhancement JavaScript - No Data Management
document.addEventListener('DOMContentLoaded', function () {
  setupUIEnhancements();
});

function setupUIEnhancements() {
  // Search input real-time feedback
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      // Add visual feedback for search
      if (this.value.length > 0) {
        this.classList.add('has-content');
      } else {
        this.classList.remove('has-content');
      }
    });

    // Initialize state
    if (searchInput.value.length > 0) {
      searchInput.classList.add('has-content');
    }
  }

  // Filter form enhancements
  const filterInputs = document.querySelectorAll('.filter-form select, .filter-form input');
  filterInputs.forEach(input => {
    input.addEventListener('change', function () {
      // Add visual feedback for active filters
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });

    // Initialize state
    if (input.value) {
      input.classList.add('has-value');
    }
  });

  // Update button enhancement
  const updateBtn = document.getElementById('updateListBtn');
  if (updateBtn) {
    const form = updateBtn.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        // Visual feedback on form submission
        updateBtn.textContent = 'Updating...';
        updateBtn.disabled = true;
        updateBtn.classList.add('loading');
      });
    }
  }

  // Dish card hover enhancements
  const dishCards = document.querySelectorAll('.dish-card');
  dishCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.classList.add('hovered');
    });

    card.addEventListener('mouseleave', function () {
      this.classList.remove('hovered');
    });
  });

  // Checkbox change visual feedback
  const checkboxes = document.querySelectorAll('.availability-checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const dishCard = this.closest('.dish-card');
      if (dishCard) {
        if (this.checked) {
          dishCard.classList.remove('unavailable');
          dishCard.classList.add('available');
        } else {
          dishCard.classList.add('unavailable');
          dishCard.classList.remove('available');
        }
      }

      // Show that changes are pending
      const updateBtn = document.getElementById('updateListBtn');
      if (updateBtn) {
        updateBtn.classList.add('has-changes');
        updateBtn.textContent = 'Update List (Changes Pending)';
      }
    });
  });

  // Handle image loading errors
  const dishImages = document.querySelectorAll('.dish-image');
  dishImages.forEach(img => {
    img.addEventListener('error', function () {
      this.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg';
      this.classList.add('fallback-image');
    });
  });

  // Smooth scroll for form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function () {
      // Smooth scroll to top after form submission
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    });
  });

  // Clear filters functionality
  addClearFiltersButton();
}

function addClearFiltersButton() {
  const filterForm = document.querySelector('.filter-form');
  if (filterForm) {
    // Check if any filters are active
    const hasActiveFilters = Array.from(filterForm.elements).some(element =>
      element.value && element.name !== 'csrfmiddlewaretoken'
    );

    if (hasActiveFilters) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'clear-filters-btn';
      clearBtn.textContent = 'Clear Filters';
      clearBtn.addEventListener('click', function () {
        // Clear all form inputs
        filterForm.reset();
        // Redirect to base URL without query parameters
        window.location.href = window.location.pathname;
      });

      filterForm.appendChild(clearBtn);
    }
  }
}

// Utility function for showing temporary messages
function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  // Auto remove after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Export for potential use in Django templates
window.DishesUI = {
  showMessage: showMessage
};




function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.querySelector(".toggle-btn");

  // Toggle sidebar
  sidebar.classList.toggle("active");

  // Icon change condition
  if (sidebar.classList.contains("active")) {
    toggleBtn.innerHTML = `<i class="fa-solid fa-circle-xmark fa-lg"></i>`;
    toggleBtn.style.left = "190px"
    toggleBtn.style.transition = "0.3s"
    // toggleBtn.style.top = "10px"


  } else {
    toggleBtn.innerHTML = `☰`;
    toggleBtn.style.left = "0"
  }
}

