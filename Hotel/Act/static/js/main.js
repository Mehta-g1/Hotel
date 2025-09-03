function toggleMenu() { document.getElementById("menu").classList.toggle("show"); }

// Navbar active link highlight
window.addEventListener("scroll", () => {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll("nav ul li a");
    let scrollY = window.scrollY;
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 100 && scrollY < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(link => link.classList.remove("active"));
            document.querySelector("nav ul li a[href*=" + sec.id + "]").classList.add("active");
        }
    });
});

// Back to top show
window.addEventListener("scroll", () => {
    document.getElementById("backToTop").style.display = window.scrollY > 400 ? "block" : "none";
});

// Fade-in cards
const cards = document.querySelectorAll(".card");
window.addEventListener("scroll", () => {
    cards.forEach(card => {
        let pos = card.getBoundingClientRect().top;
        if (pos < window.innerHeight - 50) card.classList.add("show");
    });
});