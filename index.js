const URL = 'https://fakestoreapi.com/products';
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const iconoCarrito = document.querySelector('.bi-cart');

const slideShowContainer = document.querySelector('.slideshow-container');
const containerCards = document.querySelector('.container-cards');
const listSlideShow = [];
let slideIndex = 0;
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const cardBody = document.querySelectorAll('.card-body');

fetch(URL)
    .then(response => response.json())
    .then(products => {

        function createSlideShow() {
            for (let i = 0; i < 4; i++) {
                const slideShow = document.createElement('div');
                slideShow.classList.add('slide-show', 'fade');
                slideShowContainer.appendChild(slideShow);

                let productsEnGrupo = products.slice(i * 5, (i + 1) * 5);

                productsEnGrupo.forEach(product => {
                    slideContainer = document.createElement('div');
                    slideContainer.classList.add('slide-container');
                    slideContainer.innerHTML = `
                        <img src="${product.image}" class="slide-img" title="${product.title}" data-product-id="${product.id}">
                    `;
                    slideShow.appendChild(slideContainer);
                });
                listSlideShow.push(slideShow)
            }
        }

        function showSlides(n) {
            let i;

            if (n > listSlideShow.length) {
                slideIndex = 1;
            }
            if (n < 1) {
                slideIndex = listSlideShow.length;
            }
            for (i = 0; i < listSlideShow.length; i++) {
                listSlideShow[i].style.display = 'none';
            }
            listSlideShow[slideIndex - 1].style.display = 'flex';
        }

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(function () {
                plusSlides(1);
            }, 3000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        prevButton.addEventListener('click', function () {
            plusSlides(-1);
            stopAutoSlide();
            startAutoSlide();
        });

        nextButton.addEventListener('click', function () {
            plusSlides(1);
            stopAutoSlide();
            startAutoSlide();
        });

        function createCards() {
            products.slice(0, 20).forEach(product => {
                let card = document.createElement('div');
                card.classList.add('card');
                containerCards.appendChild(card);

                const titleCorto = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

                card.innerHTML = `
                    <div class="card-body">
                        <div class="card-top"><img src="${product.image}" alt="${product.title}" class="card-image"></div>
                        <h4 class="card-title align">${titleCorto}</h4>
                        <p class="card-text align">$${product.price}</p>
                        <button class="button-card" data-product-id="${product.id}">Ver más...
                        </button>
                    </div>
                `;
            });
        }

        function getProductId() {
            const btnCard = document.querySelectorAll('.button-card');
            const slideImg = document.querySelectorAll('.slide-img');
            const productIds = [];

            btnCard.forEach(button => {
                button.addEventListener('click', function () {
                    const productId = parseInt(button.getAttribute('data-product-id'));
                    console.log('ID del producto:', productId);
                    const product = products.find(product => product.id === productId);
                    if (product) {
                        window.location.href = `producto.html?id=${productId}`;
                    } else {
                        console.log('Producto no encontrado.');
                    }
                });
                productIds.push(button);
            });
            slideImg.forEach(img => {
                img.addEventListener('click', function () {
                    const productId = parseInt(img.getAttribute('data-product-id'));
                    console.log('ID del producto:', productId);
                    const product = products.find(product => product.id === productId);
                    if (product) {
                        window.location.href = `producto.html?id=${productId}`;
                    } else {
                        console.log('Producto no encontrado.');
                    }
                });
                productIds.push(img);
            });
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

        createSlideShow();
        createCards();
        showSlides(slideIndex);
        startAutoSlide();
        getProductId();
        actualizarIconoCarrito();
    })
    .catch(error => console.log('Hubo un error al obtener los datos del producto', error));