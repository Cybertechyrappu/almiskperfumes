// Products Data
const products = [
  {
    id: '1',
    name: 'Amber Oud',
    slug: 'amber-oud',
    description: 'A rich, woody fragrance with notes of amber, oud, and sandalwood. Perfect for evening wear.',
    category: 'Woody',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    prices: { '8ml': 45, '20ml': 85, '50ml': 150, '100ml': 250 }
  },
  {
    id: '2',
    name: 'Midnight Rose',
    slug: 'midnight-rose',
    description: 'An elegant floral fragrance with Bulgarian roses, patchouli, and vanilla. Sophisticated and timeless.',
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
    prices: { '8ml': 55, '20ml': 95, '50ml': 175, '100ml': 290 }
  },
  {
    id: '3',
    name: 'Saffron Spice',
    slug: 'saffron-spice',
    description: 'An exotic blend of saffron, cardamom, and precious woods. Bold and memorable.',
    category: 'Oriental',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    prices: { '8ml': 60, '20ml': 110, '50ml': 195, '100ml': 320 }
  },
  {
    id: '4',
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    description: 'A fresh aquatic fragrance with sea notes, citrus, and white musk. Clean and invigorating.',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27dc1a28a7b9?w=800',
    prices: { '8ml': 35, '20ml': 65, '50ml': 120, '100ml': 195 }
  },
  {
    id: '5',
    name: 'Royal Musk',
    slug: 'royal-musk',
    description: 'A luxurious musk blend with amber, cedar, and exotic florals. Long-lasting and distinctive.',
    category: 'Musk',
    imageUrl: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800',
    prices: { '8ml': 50, '20ml': 90, '50ml': 165, '100ml': 275 }
  },
  {
    id: '6',
    name: 'Golden Amber',
    slug: 'golden-amber',
    description: 'A warm, golden fragrance with amber, benzoin, and vanilla bean. Pure luxury.',
    category: 'Amber',
    imageUrl: 'https://images.unsplash.com/photo-1615634260165-c991bf662c17?w=800',
    prices: { '8ml': 48, '20ml': 88, '50ml': 160, '100ml': 265 }
  }
];

// Cart Functions
let cart = JSON.parse(localStorage.getItem('almisk-cart')) || [];

function saveCart() {
  localStorage.setItem('almisk-cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(productId, size, quantity) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId && item.size === size);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      size,
      price: product.prices[size],
      quantity,
      imageUrl: product.imageUrl
    });
  }
  
  saveCart();
  alert(`${product.name} (${size}) x${quantity} added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="product.html?slug=${product.slug}">
        <img src="${product.imageUrl}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="category">${product.category}</p>
          <div class="prices">
            <span class="price">8ml: $${product.prices['8ml']}</span>
            <span class="price">20ml: $${product.prices['20ml']}</span>
          </div>
        </div>
      </a>
    </div>
  `).join('');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '$0';
    return;
  }
  
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="size">${item.size}</p>
      </div>
      <div class="cart-item-price">
        <p>$${item.price} x ${item.quantity}</p>
        <p class="total">$${item.price * item.quantity}</p>
        <button onclick="removeFromCart(${index})" style="margin-top: 10px; padding: 5px 15px; background: #c00; color: white; border: none; cursor: pointer;">Remove</button>
      </div>
    </div>
  `).join('');
  
  if (totalEl) totalEl.textContent = '$' + getCartTotal();
}

function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    document.getElementById('product-detail').innerHTML = '<p>Product not found. <a href="collection.html" style="color: var(--gold);">Back to Collection</a></p>';
    return;
  }
  
  document.getElementById('product-image').src = product.imageUrl;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-description').textContent = product.description;
  
  const select = document.getElementById('size-select');
  select.innerHTML = Object.entries(product.prices).map(([size, price]) => 
    `<option value="${size}">${size} - $${price}</option>`
  ).join('');
  
  select.addEventListener('change', updatePrice);
  updatePrice();
}

function updatePrice() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const product = products.find(p => p.slug === slug);
  const select = document.getElementById('size-select');
  const addBtn = document.getElementById('add-to-cart');
  
  if (product && select && addBtn) {
    const size = select.value;
    const price = product.prices[size];
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    addBtn.textContent = `Add to Cart - $${price * qty}`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  if (document.getElementById('products-grid')) {
    renderProducts();
  }
  
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  
  if (document.getElementById('product-detail')) {
    loadProduct();
  }
});