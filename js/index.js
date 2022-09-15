// Banco de dados dos produtos

const data = [
	{
		id: 1,
		img: "./img/pinkanthurium.jpg",
		nameItem: "Pink Anthurium",
		description:
			"With pink heart-shaped flowers floating amongst bright exotic greenery a pink anthurium is an ideal way to show that your love travels the distance.",
		value: 259,
		addCart: "Adicionar ao carrinho",
		tag: ["Plantas"],
	},
	{
		id: 2,
		img: "./img/whiteorchid.jpg",
		nameItem: "White Orchid",
		description:
			"The orchid is an elegant flower associated with young souls. This white orchid is the perfect gift for filling a loved one’s home with life. With some basic care, it will flower several times a year.",
		value: 100,
		addCart: "Adicionar ao carrinho",
		tag: ["Plantas"],
	},
	{
		id: 3,
		img: "./img/tigerorchid.jpg",
		nameItem: "Tiger Orchid",
		description:
			"One of the most unique varieties of the phalaenopsis orchid around. Its cream petals with splashes and specks of pink are reminiscent of tiger skin, making this orchid really stand out.",
		value: 334,
		addCart: "Adicionar ao carrinho",
		tag: ["Plantas"],
	},
	{
		id: 4,
		img: "./img/liliesandroses.jpg",
		nameItem: "Lilies and Roses",
		description:
			"A classic design that gives off simplicity and purity. Whatever the occasion, it will make its recipient’s day.",
		value: 305,
		addCart: "Adicionar ao carrinho",
		tag: ["Flores"],
	},
	{
		id: 5,
		img: "./img/rosesandasters.jpg",
		nameItem: "Roses and Asters",
		description:
			"Discover a gorgeous fresh bouquet where orange roses, along with purple asters and statice, evoke the special splendour of sunsets.",
		value: 283,
		addCart: "Adicionar ao carrinho",
		tag: ["Flores"],
	},
	{
		id: 6,
		img: "./img/rosesandlilies.jpg",
		nameItem: "Roses and Lilies",
		description:
			"Pink is known to be the color of serenity, positive energy, inspiration and hope. A uniquely designed best-selling beauty that knows the true meaning of flower power.",
		value: 100,
		addCart: "Adicionar ao carrinho",
		tag: ["Flores"],
	},
];

const flores = data.filter((item) => item.tag.includes("Flores"));
const plantas = data.filter((item) => item.tag.includes("Plantas"));
const grid = document.querySelector(".grid");

// FUNÇAO PARA GERAR OS ITENS E COLOCA-LOS NA PAGINA

const generateItens = (list) => {
	return (grid.innerHTML = list
		.map((item) => {
			let { id, img, nameItem, description, value, tag } = item;
			return `<div class="card" id="${id}"><img class="card-img" src="${img}"><span class="card-type" id="${tag}">${tag}</span><h2 class="card-title">${nameItem}</h2><p class="card-description">${description}.</p><span class="card-price">R$ ${value},00</span><button class="card-btn">Adicionar ao carrinho</button></div>`;
		})
		.join(" "));
};

// FUNÇÃO PARA FILTRAR OS ITENS BASEADO NA SUA CATEGORIA

function filter() {
	const navBtn = document.querySelectorAll(".menu .btn");

	navBtn[0].classList.add("active");
	generateItens(data);

	function tabFilter(e) {
		navBtn.forEach((btn) => btn.classList.remove("active"));
		e.target.classList.add("active");

		if (e.target.id === "flores") {
			generateItens(flores);
			update();
		} else if (e.target.id === "plantas") {
			generateItens(plantas);
			update();
		} else if (e.target.id === "all") {
			generateItens(data);
			update();
		}
	}

	navBtn.forEach((btn) => {
		btn.addEventListener("click", tabFilter);
	});
}
filter();

///////////////// CARRINHO DE COMPRAS ///////////////////

const cart = document.getElementById("side-menu");
const initCartBtn = document.getElementById("cart-btn");

function initCart() {
	// FUNÇAO PARA ABRIR O CARRINHO

	cart.classList.add("ativo");
	this.classList.add("active");
}
initCartBtn.addEventListener("mouseenter", initCart);

function closeCart() {
	// FUNÇÃO PARA FECHAR O CARRINHO

	this.classList.remove("ativo");
	initCartBtn.classList.remove("active");
}

cart.addEventListener("mouseleave", closeCart);

function update() {
	addEvents();
	updateTotal();
}

//////////// EVENTOS /////////////////

function addEvents() {
	// REMOVER ITENS DO CARRINHO
	const removeBtn = cart.querySelectorAll(".btn");
	removeBtn.forEach((btn) => btn.addEventListener("click", deleteItem));

	// ADICIONAR ITENS NO CARRINHO
	const addCartBtn = document.querySelectorAll(".card-btn");
	addCartBtn.forEach((btn) => {
		btn.addEventListener("click", addItem);
	});

	// BARRA DE PESQUISA

	const searchBtn = document.getElementById("search-btn");
	searchBtn.addEventListener("click", search);
}
addEvents();

////// HANDLES DOS EVENTOS ///////

// ADICIONA ITENS
function addItem() {
	let product = this.parentElement;
	let img = product.querySelector(".card-img").src;
	let title = product.querySelector(".card-title").innerHTML;
	let price = product.querySelector(".card-price").innerHTML;

	let newToAdd = {
		title,
		price,
		img,
	};

	let cartItem = cartItemComponent(title, price, img);
	let li = document.createElement("li");
	li.classList.add("cart-item");
	li.innerHTML = cartItem;
	let cartList = document.querySelector(".cart-list");
	cartList.appendChild(li);

	// POP-UP

	const addModal = document.querySelector(".add-modal");
	addModal.classList.add("ativo");

	function closePopUp() {
		addModal.classList.remove("ativo");
	}

	setTimeout(closePopUp, 4000);

	update();
}

// REMOVE ITENS
function deleteItem() {
	this.parentElement.remove();
	update();
}

// PESQUISA
function search(e) {
	e.preventDefault();
	const searchInput = document.getElementById("search-input");
	const inputValue = searchInput.value;
	const notFound = document.querySelector(".not-found");

	if (inputValue) {
		const filter = generateItens(
			data.filter((item) => {
				return item.nameItem.toLowerCase().includes(inputValue.toLowerCase());
			})
		);
		update();

		if (filter === "") {
			notFound.classList.add("show");
		} else {
			notFound.classList.remove("show");
		}
	}

	function validateInput() {
		if (this.value === "") {
			generateItens(data);
			notFound.classList.remove("show");
			update();
		}
	}
	searchInput.addEventListener("keyup", validateInput);
}

////// FUNÇÃO PARA ATUALIZAR O TOTAL DO CARRINHO //////

function updateTotal() {
	const empty = document.querySelector(".empty");
	const cards = document.querySelectorAll(".cart-item");
	const cartCounter = document.querySelector(".cart-counter");
	const totalElements = cart.querySelector("#qt-value");
	const totalPrice = cart.querySelector("#price-value");
	let total = 0;
	let quantity = 0;
	cards.forEach((card) => {
		const priceElement = card.querySelector(".cart-price");
		const price = parseFloat(priceElement.innerHTML.slice(3).replace(",", "."));
		total += price;
		quantity++;
	});
	totalElements.innerHTML = quantity;
	cartCounter.innerHTML = quantity;
	totalPrice.innerHTML = "R$" + total;

	if (quantity >= 1) {
		empty.classList.add("hide");
	} else {
		empty.classList.remove("hide");
	}
}

//// COMPONENTES DOS PRODUTOS DO CARRINHO /////

function cartItemComponent(title, price, img) {
	return `
            <img src="${img}">
            <h2 class="cart-title">${title}</h2>
            <span class="cart-price">${price}</span>
            <button class="btn"><span class="material-symbols-outlined">delete</span></button>`;
}
