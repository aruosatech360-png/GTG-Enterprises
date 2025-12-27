// --- DATA SOURCE (Backend will eventually serve this via API) ---
const products = [
    { id: 1, name: "Elite Chronograph", price: 45000, category: "Fashion", platform: "Jumia", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", description: "Premium stainless steel watch with water resistance up to 50m. Comes with original box and warranty card.", phone: "080-1234-5678", isVerified: true },
    { id: 2, name: "Wireless Headphones", price: 25000, category: "Electronics", platform: "Konga", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80", description: "Noise cancelling wireless headphones with 20h battery life.", phone: "081-9876-5432", isVerified: false },
    { id: 3, name: "Modern Sofa", price: 150000, category: "Home", platform: "Jiji", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80", description: "3-seater grey fabric sofa. Very comfortable and modern design.", phone: "070-5555-4444", isVerified: true },
    { id: 4, name: "Running Shoes", price: 18000, category: "Fashion", platform: "Jumia", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", description: "Lightweight running shoes, size 42. Breathable mesh material.", phone: "090-1122-3344", isVerified: false },
    { id: 5, name: "Smart Watch", price: 30000, category: "Electronics", platform: "Konga", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80", description: "Fitness tracker with heart rate monitor and sleep tracking.", phone: "080-2222-3333", isVerified: true },
    { id: 6, name: "Office Chair", price: 45000, category: "Home", platform: "Jumia", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=500&q=80", description: "Ergonomic office chair with lumbar support and adjustable height.", phone: "081-3333-4444", isVerified: true },
];

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('gtg-cart')) || [];

function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(el => el.innerText = cart.length);
}

function addToCart(id) {
    // Handle both ID (number) and direct object passing (if legacy code calls it differently)
    let product;
    if (typeof id === 'object') {
        // Legacy support if passed as object
        cart.push(id);
    } else {
        product = products.find(p => p.id === id);
        if (!product) return;
        cart.push({ name: product.name, price: product.price, image: product.image, id: product.id });
    }
    
    localStorage.setItem('gtg-cart', JSON.stringify(cart));
    updateCartCount();
    
    // Dispatch event for other listeners (like the sidebar UI)
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show feedback (Toast)
    showToast("Item added to cart");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('gtg-cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
}

function clearCart() {
    cart = [];
    localStorage.setItem('gtg-cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
}

// --- UI UTILITIES ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

function showToast(message, type = 'default') {
    // Simple toast implementation
    const toast = document.createElement('div');
    let bgClass = "bg-gray-900";
    if (type === 'error') bgClass = "bg-red-600";

    toast.className = `fixed bottom-4 right-4 ${bgClass} text-white px-6 py-3 rounded-lg shadow-xl z-[200] animate-bounce`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    lucide.createIcons();

    // Mobile Menu Listener
    const btn = document.getElementById('mobile-menu-btn');
    if(btn) btn.addEventListener('click', toggleMobileMenu);
});

// --- SHARED MODAL LOGIC (Used in Index and Store) ---
let currentModalItem = {};

function openModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentModalItem = product;
    
    const titleEl = document.getElementById('modal-title');
    if(titleEl) {
        titleEl.innerText = product.name;
        document.getElementById('modal-category').innerText = `${product.category} > ${product.platform}`;
        document.getElementById('modal-desc').innerText = product.description || "No description provided.";
        document.getElementById('modal-phone').innerText = product.phone || "Contact not available";
        document.getElementById('modal-price').innerText = `₦${product.price.toLocaleString()}`;
        
        // Simple image set for now
        const track = document.getElementById('modal-slider-track');
        if(track) {
            track.innerHTML = `<div class="w-full h-full shrink-0 flex items-center justify-center bg-white"><img src="${product.image}" class="max-w-full max-h-full object-contain"></div>`;
        }

        const verifiedEl = document.getElementById('modal-verified');
        if(verifiedEl) {
            product.isVerified ? verifiedEl.classList.remove('hidden') : verifiedEl.classList.add('hidden');
        }

        document.getElementById('product-modal').classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if(modal) modal.classList.add('hidden');
}

function modalAddToCart() {
    if (currentModalItem && currentModalItem.id) {
        addToCart(currentModalItem.id);
        closeModal();
    }
}