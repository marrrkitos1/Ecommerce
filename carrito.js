const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const iconoCarrito = document.querySelector('.bi-cart');
const carritoContainer = document.querySelector('.carrito-container');
const precioTotalContainer = document.querySelector('.precio-total');
const btnComprar = document.querySelector('.comprar-btn');
const loadingIcon = document.querySelector('#loading-icon');
const formContainer = document.querySelector('#form-container');
const purchaseForm = document.querySelector('#purchase-form');
const successMessage = document.querySelector('.mensaje-compra');

function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    carrito.forEach((producto, index) => {
        const carritoItem = document.createElement('div');
        carritoItem.classList.add('carrito-item');
        carritoItem.innerHTML = `
            <h2 class="item-title">${producto.title}</h2>
            <p class="cantidad">Cantidad: <span class="cantidad">${producto.cantidad}</span></p>
            <p class="precio">Precio: $${producto.price}</p>
            <div class="img-div"><img src="" class="product-img"></div>
            <button class="btn-delete" data-index="${index}">Eliminar unidad</button>
        `;
        carritoContainer.appendChild(carritoItem);
        
        fetch(`https://fakestoreapi.com/products/${producto.id}`)
            .then(response => response.json())
            .then(product => {
                const imgElement = carritoItem.querySelector('.product-img');
                if (product.image) {
                    imgElement.src = product.image;
                }
            })
            .catch(error => console.log('Hubo un error al obtener la imagen del producto', error));
    });
    btnComprar.addEventListener('click', () => {
        btnComprar.style.display = 'none';
        formContainer.style.display = 'block';
    
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formContainer.style.display = 'none';
            loadingIcon.style.display = 'inline';
    
            setTimeout (() => {
                setTimeout(() => {
                loadingIcon.style.display = 'none';
                successMessage.style.display = 'block';
                }, 50);
                vaciarCarrito();
            }, 2000);
        });
    });
    agregarEventListenersEliminar();
    calcularPrecioTotal();
    actualizarIconoCarrito();
    crearBtnComprar ();
}

function agregarEventListenersEliminar() {
    const btnEliminar = document.querySelectorAll('.btn-delete');
    btnEliminar.forEach((button, index) => {
        button.addEventListener('click', () => {
            eliminarProducto(index);
        });
    });
}

function vaciarCarrito () {
    carritoContainer.innerHTML = '';
    carrito.length = 0;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    while (carritoContainer.firstChild) {
        carritoContainer.removeChild(carritoContainer.firstChild);
    }
}

function eliminarProducto(index) {
    const productoEliminado = carrito[index];
    if (productoEliminado) {
        if (productoEliminado.cantidad > 1) {
            productoEliminado.cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}

function calcularPrecioTotal() {
    if (carrito.length === 0) {
        precioTotalContainer.textContent = 'No hay productos en el carrito';
    } else {
        const precioTotal = carrito.reduce((total, producto) => {
            return total + producto.price * producto.cantidad;
        }, 0);
        precioTotalContainer.textContent = `Precio Total: $${precioTotal.toFixed(2)}`;
    }
}

function crearBtnComprar () {
    if (carrito.length === 0) {
        btnComprar.style.display = 'none';
    }
    else {
        btnComprar.style.display = 'block';
        btnComprar.textContent = 'Comprar';
    }
}

function actualizarIconoCarrito() {
    if (carrito.length > 0) {
        iconoCarrito.classList.remove('bi-cart');
        iconoCarrito.classList.add('bi-cart-fill');
    } else {
        iconoCarrito.classList.remove('bi-cart-fill');
        iconoCarrito.classList.add('bi-cart');
    }
}

actualizarCarrito();
