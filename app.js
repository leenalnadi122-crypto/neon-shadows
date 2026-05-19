let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listproduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let cartCount = document.querySelector('.cartCount');

let listProduct = [
    {
        "id": 1,
        "name": "Blood music",
        "price": 200,
        "image": "./photos/ArtbySterlingHundley.jpeg"
    },
    {
        "id": 2,
        "name": "No Face ",
        "price": 250,
        "image": "./photos/download(26).jpeg"
    },
    {
        "id": 3,
        "name": "Getting lost",
        "price": 175,
        "image": "./photos/download(27).jpeg"
    },
    {
        "id": 4,
        "name": "bear",
        "price": 300,
        "image": "./photos/download(28).jpeg"
    },
    {
        "id": 5,
        "name": "Love fantasy",
        "price": 200,
        "image": "./photos/download(29).jpeg"
    },
    {
        "id": 6,
        "name": "Lost",
        "price": 195,
        "image": "./photos/download(30).jpeg"
    }
];
let carts = [];
cartCount.innerText = 0

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src=${product.image} alt="ArtbySterlingHundley">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        // carts.push(product_id)
        addToCart(product_id);
    }
});
const addToCart = (product_id) => {

    cartCount.innerText = carts.length + 1 || 0

    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts.push({
            product_id: product_id,
            quentity: 1
        })
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quentity: 1
        });

    } else {
        carts[positionThisProductInCart].quentity = carts[positionThisProductInCart].quentity + 1;
    }

    addToCartHTML();

}
const addToCartHTML = () => {
    listCartHTML.innerHTML = '';
    if (carts.length > 0) {


        carts.forEach(cart => {
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            const cartItem = listProduct.find((item) => item.id == cart.product_id)


            newCart.innerHTML = ` <div class="image">
                        <img src=${cartItem.image} alt="ArtbySterlingHundley">
                    </div>
                    <div class="name">
                        ${cartItem.name}
                    </div>
                    <div class="totalPrice">
                        ${cartItem.price}
                    </div>
                    <div class="quantity">
                        <span class='minus'> -
                        </span>
                        <span>${cart.quentity}</span>
                        <span class="">+</span>

                    </div> 
            `
            listCartHTML.appendChild(newCart);
        })
    }
}
document.querySelector('.close-cart').addEventListener('click', () => {
    document.querySelector('.cart-overlay').style.display = 'none';
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
    alert('Proceeding to checkout!');
});



const initApp = () => {
    addDataToHTML();
};

initApp();
