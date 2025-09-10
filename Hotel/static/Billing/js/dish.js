
// UI Enhancement JavaScript - No Data Management
// document.addEventListener('DOMContentLoaded', function () {
//   setupUIEnhancements();
// });



// function addClearFiltersButton() {
//   const filterForm = document.querySelector('.filter-form');
//   if (filterForm) {
//     // Check if any filters are active
//     const hasActiveFilters = Array.from(filterForm.elements).some(element =>
//       element.value && element.name !== 'csrfmiddlewaretoken'
//     );

//     if (hasActiveFilters) {
//       const clearBtn = document.createElement('button');
//       clearBtn.type = 'button';
//       clearBtn.className = 'clear-filters-btn';
//       clearBtn.textContent = 'Clear Filters';
//       clearBtn.addEventListener('click', function () {
//         // Clear all form inputs
//         filterForm.reset();
//         // Redirect to base URL without query parameters
//         window.location.href = window.location.pathname;
//       });

//       filterForm.appendChild(clearBtn);
//     }
//   }
// }

// Utility function for showing temporary messages
// function showMessage(message, type = 'success') {
//   const messageDiv = document.createElement('div');
//   messageDiv.className = `message message-${type}`;
//   messageDiv.textContent = message;

//   document.body.appendChild(messageDiv);

//   // Auto remove after 3 seconds
//   setTimeout(() => {
//     messageDiv.remove();
//   }, 3000);
// }

// Export for potential use in Django templates
// window.DishesUI = {
//   showMessage: showMessage
// };




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

