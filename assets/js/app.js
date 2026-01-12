// assets/js/app.js

document.addEventListener("DOMContentLoaded", function () {
    loadHeader();
    loadFooter();
    updateGlobalCartCount();
    injectLoginModal(); // Inject the popup HTML into every page
});

// --- 1. LOGIN POPUP (The "Pyara sa Pop-up") ---
function injectLoginModal() {
    const modalHTML = `
        <div id="custom-login-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; width: 300px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <div style="font-size: 3rem; margin-bottom: 15px;">🔒</div>
                <h3 style="color: #3b2a1e; margin-bottom: 10px;">Login Required</h3>
                <p style="color: #666; margin-bottom: 20px;">Please login to access your cart and place orders.</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="closeLoginModal()" style="padding: 10px 20px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                    <a href="/pages/login.html" style="padding: 10px 20px; background: #c7a17a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showLoginPopup() {
    document.getElementById('custom-login-modal').style.display = 'flex';
    return false; // Prevent link click
}

function closeLoginModal() {
    document.getElementById('custom-login-modal').style.display = 'none';
}

// Check Logic for Links
function checkAuthLink(e) {
    const user = localStorage.getItem('user');
    if (!user) {
        if(e) e.preventDefault();
        showLoginPopup(); // Show the beautiful popup
        return false;
    }
    return true;
}

// --- 2. HEADER INJECTION ---
function loadHeader() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = user !== null;

    const navLinks = `
        <li><a href="/index.html">Home</a></li>
        <li><a href="/pages/menu.html">Menu</a></li>
        <li><a href="/pages/about.html">About Us</a></li>
        <li><a href="/pages/contact.html">Contact</a></li>
    `;

    let authButton = isLoggedIn ? 
        `<a href="#" class="btn-login btn-logout" onclick="logoutUser()">Logout</a>` : 
        `<a href="/pages/login.html" class="btn-login">Login</a>`;

    headerPlaceholder.innerHTML = `
        <div class="hamburger" onclick="toggleSidebar()"><span>☰</span></div>
        <div class="sidebar" id="sidebar">
            <div class="close-btn" onclick="toggleSidebar()">×</div>
            <h3>Coffee Break</h3>
            <ul>
                ${navLinks}
                <li><a href="/pages/cart.html" onclick="return checkAuthLink(event)">Cart (<span id="mobile-cart-count">0</span>)</a></li>
                <li class="sidebar-auth">${authButton}</li>
            </ul>
        </div>
        <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>

        <header>
            <nav class="main-nav">
                <a href="/index.html" class="nav-logo">Coffee Break</a>
                <ul class="desktop-menu">${navLinks}</ul>
                <div class="nav-actions">
                    <a href="/pages/cart.html" class="cart-link" onclick="return checkAuthLink(event)">
                        🛒 <span class="cart-count" id="cart-count">0</span>
                    </a>
                    <div class="desktop-auth">${authButton}</div>
                </div>
            </nav>
        </header>
    `;
    updateGlobalCartCount();
}

function logoutUser() {
    if(confirm("Log out?")) {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}

// Helper Functions
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function updateGlobalCartCount() {
    const cart = JSON.parse(localStorage.getItem('coffee_cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const d = document.getElementById('cart-count');
    const m = document.getElementById('mobile-cart-count');
    if(d) d.textContent = count;
    if(m) m.textContent = count;
}
function loadFooter() {
    const f = document.getElementById("footer-placeholder");
    if (f) f.innerHTML = `<footer><p>&copy; 2026 Coffee Break</p></footer>`;
}