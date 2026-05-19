const gallery = document.querySelector('.gallery');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCart = document.querySelector('.close-cart');
const iconCart = document.querySelector('.icon-cart');
const favoraitItem = document.querySelector('.favoraitItem');

let cart = [];
let favItems = JSON.parse(localStorage.getItem('favItems')) || [];

const products = [
    { id: 1, name: "Bear", price: 300, image: "./photos/download(28).jpeg" },
    { id: 2, name: "Getting Lost", price: 175, image: "./photos/download(27).jpeg" },
    { id: 3, name: "No Face", price: 250, image: "./photos/download(26).jpeg" },
    { id: 4, name: "Blood music", price: 250, image: "./photos/ArtbySterlingHundley.jpeg" },
    { id: 5, name: "Love fantasy", price: 350, image: "./photos/download(29).jpeg" },
    { id: 6, name: "Lost", price: 460, image: "./photos/download(30).jpeg" },
    { id: 7, name: "Find Face", price: 370, image: "./photos/Playstationadsfromlate1990’s_early2000.jpeg" },
    { id: 8, name: "Roxana Halls", price: 550, image: "./photos/RoxanaHalls.jpeg" },
    { id: 9, name: "Old Man Guitar", price: 150, image: "./photos/TheEvolutionof Picasso's Painting Style and What EachArtisticChoiceRepresents.jpeg" },
    { id: 10, name: " Vincent VanGogh", price: 500, image: "./photos/VincentvanGogh-SelfPortrait,1887atArtInstituteofChicagoIL.jpeg" },

];

function saveFavItems() {
    localStorage.setItem('favItems', JSON.stringify(favItems));
}
function renderGallery() {
    gallery.innerHTML = '';
    products.forEach(product => {
        const isFavorited = favItems.find(item => item.id == product.id);

        gallery.innerHTML += `
      <div class="art-item">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price">$${product.price}</div>
        <div class="buttons">
          <button class="add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                           <button class="add-fav ${isFavorited ? 'favorited' : ''}" data-id="${product.id}">♥</button>

          </div>
      </div>
    `;
    });
    const favButtons = document.querySelectorAll('.add-fav');
    favButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const index = favItems.findIndex(item => item.id === productId);

            if (index === -1) {
                favItems.push(product);
            } else {
                favItems.splice(index, 1);
            }

            saveFavItems();        // ✅ Save to localStorage
            renderGallery();       // Update gallery heart colors
            renderFavItem();       // Update favorites section
        });
    });
}


function renderFavItem() {
    if (!favoraitItem) {
        return;
    }

    favoraitItem.innerHTML = '';
    console.log(favItems, "favItems");

    favItems.forEach(product => {
        favoraitItem.innerHTML += `
        <div class="art-item">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price}</div>
        </div>
        `;
    });
}

renderFavItem();
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}


function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" />
        <h4>${item.name}</h4>
        <div>
          <button onclick="updateQty(${item.id}, -1)">−</button>
          ${item.qty}
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
    });
    cartTotal.textContent = total;
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    renderCart();
}

iconCart.addEventListener('click', () => {
    cartOverlay.classList.add('show');
});

closeCart.addEventListener('click', () => {
    cartOverlay.classList.remove('show');
});

// Initialize
renderGallery();
