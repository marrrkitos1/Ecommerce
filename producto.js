const URL = 'https://fakestoreapi.com/products';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const iconoCarrito = document.querySelector('.bi-cart');

fetch(`${URL}/${productId}`)
    .then(response => response.json())
    .then(product => {
        actualizarIconoCarrito();
        if (product) {
            const productDetailsContainer = document.querySelector('.product-details-container');
            productDetailsContainer.innerHTML = `
                <div class="product-left">
                    <img src="${product.image}" alt="${product.title}" class="product-img">
                </div>
                <div class="product-right">
                    <h1 class="product-h1">${product.title}</h1>
                    <p class="product-p">Descripción: ${product.description}</p>
                    <p class="product-price">Precio: $${product.price}</p>
                    <div class="btn-div"><a class="volver-btn" href="index.html"><i class="bi bi-arrow-left"></i></a><button class="product-btn">Agregar al carrito</button><a class="volver-btn" href="carrito.html"><i class="bi bi-arrow-right"></i></a></div>
                </div>
            `;
            const btnAgregarAlCarrito = document.querySelector('.product-btn');
            btnAgregarAlCarrito.addEventListener('click', () => {
                agregarAlCarrito(product);
                actualizarIconoCarrito();
            });
        } else {
            console.log('Producto no encontrado.');
        }
    })
    .catch(error => console.log('Hubo un error al obtener los datos del producto', error));

    function actualizarIconoCarrito() {
        if (carrito.length > 0) {
            iconoCarrito.classList.remove('bi-cart');
            iconoCarrito.classList.add('bi-cart-fill');
        } else {
            iconoCarrito.classList.remove('bi-cart-fill');
            iconoCarrito.classList.add('bi-cart');
        }
    }

    function agregarAlCarrito(product) {
        const carritoItem = carrito.find(item => item.id === product.id);
        if (carritoItem) {
            carritoItem.cantidad += 1;
        } else {
            carrito.push({
                id: product.id,
                title: product.title,
                price: product.price,
                cantidad: 1
            });
    
            const imagenesEnCache = JSON.parse(localStorage.getItem('imagenesCache')) || {};
            imagenesEnCache[product.id] = product.image;
            localStorage.setItem('imagenesCache', JSON.stringify(imagenesEnCache));
        }
    
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }