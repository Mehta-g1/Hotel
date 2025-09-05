// function openDetail(pageId) {
//     document.getElementById("main-content").style.display = "none";
//     document.querySelectorAll(".detail-page").forEach(p => p.style.display = "none");
//     document.getElementById(pageId).style.display = "block";
// }


// function goBack() {
//     document.querySelectorAll(".detail-page").forEach(page => page.style.display = "none");
//     document.getElementById("main-content").style.display = "block";
// }

// function searchFood() {
//     let input = document.getElementById("searchInput").value.toLowerCase();
//     let allTextElements = document.querySelectorAll("li, .food-card h4, .category h3");

//     let found = false;
//     allTextElements.forEach(el => {
//         el.classList.remove("highlight");
//         if (el.textContent.toLowerCase().includes(input) && input !== "") {
//             el.classList.add("highlight");
//             found = true;
//         }
//     });

//     if (!found && input !== "") {
//         alert("😔 Food not found!");
//     }
// }



function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}