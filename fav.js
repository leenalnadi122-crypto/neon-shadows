let favoritesContainer = document.querySelector('.favorites-container');
let favoriteItems = JSON.parse(localStorage.getItem('favorites')) || [];

fetch('products.json')
    .then(res => res.json())
    .then(products => {
        let favoriteProducts = products.filter(product => favoriteItems.includes(product.id.toString()));

        if (favoriteProducts.length === 0) {
            favoritesContainer.innerHTML = "<p>لا توجد لوحات مفضلة بعد.</p>";
        } else {
            favoriteProducts.forEach(product => {
                let item = document.createElement('div');
                item.classList.add('item');
                item.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <div class="price">$${product.price}</div>
        `;
                favoritesContainer.appendChild(item);
            });
        }
    });
