const products = [
    { id: 1, name: "Cokelat Lumer Nutella", category: "lumer", price: 12000, badge: "Best Seller", image: "donatcoklat.jpg.jpg", desc: "Donat lembut diisi dan dilumuri selai cokelat premium leleh yang kaya rasa." },
    { id: 2, name: "Classic Gula Halus", category: "classic", price: 3000, badge: "Favorit", image: "donatgula.jpeg.jpeg", desc: "Donat kentang tradisional dengan taburan gula halus salju yang lembut." },
    { id: 3, name: "Matcha Lava Green Tea", category: "lumer", price: 5000, badge: "Baru", image: "donatmatcha.avif.avif", desc: "Topping glaze Matcha autentik Jepang dengan sensasi krim lumer manis pahit seimbang." },
    { id: 4, name: "Keju Gondrong Cheddar", category: "classic", price: 4000, badge: "Gurih", image: "donatkeju.jpg.jpg", desc: "Melimpah dengan parutan keju cheddar gurih di atas krim butter halus." },
    { id: 5, name: "Tiramisu Glaze Crunch", category: "lumer", price: 5500, badge: "Populer", image: "donattiramisu.jpg.jpg", desc: "Cita rasa kopi tiramisu legit dengan taburan remahan biskuit renyah." },
    { id: 6, name: "Strawberry Cream Fill", category: "lumer", price: 6000, badge: "Segar", image: "donatStrawberry Cream Fill.jpg.jpg", desc: "Donat dengan isian selai stroberi manis segar buatan sendiri." },
    { id: 7, name: "Paket Hampers Party Box (Isi 12)", category: "hampers", price: 61000, badge: "Hemat 15%", image: "partybox.jfif.jfif", desc: "Bisa pilih mix 12 varian donat favorit dalam kemasan gift box eksklusif." },
    { id: 8, name: "Paket Half Dozen Mix (Isi 6)", category: "hampers", price: 36000, badge: "Paket Harian", image: "half doozen.jfif.jfif", desc: "Kotak isi 6 donat kombinasi varian Classic dan Lumer." }
];

let cart = [];

const productGrid = document.getElementById('productGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartTotalItems = document.getElementById('cartTotalItems');
const checkoutWaBtn = document.getElementById('checkoutWaBtn');
const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast'));

const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
}).format(amount);

function showToast(message) {
    document.getElementById('toastMsg').textContent = message;
    toast.show();
}

function renderProducts(category = 'all') {
    productGrid.innerHTML = '';
    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const column = document.createElement('div');
        column.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
        column.innerHTML = `
            <article class="card product-card h-100">
                <div class="product-image-wrap">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <span class="badge text-bg-light product-badge">${product.badge}</span>
                </div>
                <div class="card-body d-flex flex-column p-3">
                    <h3 class="h6 fw-bold mb-2">${product.name}</h3>
                    <p class="small text-secondary line-clamp-2 mb-3">${product.desc}</p>
                    <div class="d-flex justify-content-between align-items-end gap-2 mt-auto border-top pt-3">
                        <div><span class="d-block small text-secondary">Harga</span><strong class="fs-5">${formatRupiah(product.price)}</strong></div>
                        <button class="btn-add" type="button" data-add-product="${product.id}" aria-label="Tambah ${product.name} ke keranjang"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </article>`;
        productGrid.appendChild(column);
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    showToast(`${product.name} ditambahkan!`);
}

function updateQty(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.qty += change;
    if (cartItem.qty <= 0) cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalQty;
    cartBadge.classList.toggle('d-none', totalQty === 0);
    cartItemsContainer.replaceChildren();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="text-center text-secondary my-auto py-5"><i class="fa-solid fa-basket-shopping display-5 text-body-tertiary"></i><p class="small mt-3 mb-0">Keranjang donat Anda masih kosong.</p></div>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item d-flex align-items-center justify-content-between gap-2';
            itemElement.innerHTML = `
                <div class="d-flex align-items-center gap-3 min-w-0">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="text-truncate"><strong class="d-block small text-truncate">${item.name}</strong><span class="small brand-text fw-semibold">${formatRupiah(item.price)}</span></div>
                </div>
                <div class="qty-controls flex-shrink-0">
                    <button type="button" data-qty="-1" data-product-id="${item.id}" aria-label="Kurangi jumlah">−</button>
                    <span class="small fw-bold" aria-live="polite">${item.qty}</span>
                    <button type="button" data-qty="1" data-product-id="${item.id}" aria-label="Tambah jumlah">+</button>
                </div>`;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalPrice.textContent = formatRupiah(totalPrice);
    cartTotalItems.textContent = `${totalQty} pcs`;
}

productGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-add-product]');
    if (button) addToCart(Number(button.dataset.addProduct));
});

cartItemsContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-qty]');
    if (button) updateQty(Number(button.dataset.productId), Number(button.dataset.qty));
});

filterBtns.forEach(button => {
    button.addEventListener('click', () => {
        filterBtns.forEach(filterButton => filterButton.classList.toggle('active', filterButton === button));
        renderProducts(button.dataset.category);
    });
});

checkoutWaBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Keranjang belanja masih kosong. Silakan pilih donat terlebih dahulu.');
        return;
    }

    const delivery = document.getElementById('deliveryType').value;
    const notes = document.getElementById('orderNotes').value || '-';
    let message = 'Halo *Donatela*, Saya mau pesan donat berikut:\n\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.qty}x) = ${formatRupiah(item.price * item.qty)}\n`;
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    message += '\n--------------------------------\n';
    message += `*Total Pesanan:* ${formatRupiah(totalPrice)}\n`;
    message += `*Pengiriman:* ${delivery}\n`;
    message += `*Catatan:* ${notes}\n\n`;
    message += 'Mohon konfirmasi pesanan dan informasi ongkir ya Kak. Terima kasih!';

    window.open(`https://wa.me/628979163029?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

updateCartUI();
renderProducts();
