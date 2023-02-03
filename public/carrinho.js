const botoesCompra = [... document.querySelectorAll('.btnComprar')];
const templateProdutoCarrinho = document.querySelector("#produtoCarrinho");
let carrinhoHTML = document.getElementById("carrinho");
let carrinho = [];

const precos = [{nome: 'Produto 1', preco: 15}, {nome: 'Produto 2', preco: 15}, {nome: 'Produto 3', preco: 15}];

const objProduto = (nome, quantidade) => {
	return {
		nome, quantidade
	};
};
const produtoNoCarrinho = (carrinho, nome) => {
	if (carrinho.length === 0)
		return false;

	for (let i = 0; i < carrinho.length; i++) {
		if (carrinho[i].nome === nome) {
			return true;
		}
	}

	return false;
};
const alteraQuantidadeProduto = (carrinho, nome, novaQuantidade) => {
	carrinho.forEach(produto => {
		if (produto.nome === nome && novaQuantidade > 0)
			produto.quantidade = novaQuantidade;
	});

	atualizaCarrinho(carrinho);
};

const buscaPrecoProduto = (produto) => {
	let preco = 0;
	precos.forEach(elemento => {
		if (elemento.nome === produto)
			preco = elemento.preco;
			
	});

	return preco;
}

const atualizaCarrinho = (carrinho) => {
	let subtotal = carrinhoHTML.querySelector('.subtotal');
	if (subtotal)
		subtotal.remove();
	let tmp = carrinhoHTML.querySelectorAll(".produtoCarrinho");
	tmp.forEach(elemento => {
		elemento.remove();
	})
	carrinho.forEach(produto => {
		let clon = templateProdutoCarrinho.content.cloneNode(true);
		clon.querySelector('.nomeProduto').textContent = produto.nome;
		clon.querySelector('i.removerProduto').setAttribute('data-product', produto.nome);
		clon.querySelector('[name="quantidade"]').setAttribute('data-product', produto.nome);
		clon.querySelector('[name="quantidade"]').value = produto.quantidade;
		clon.querySelector('.precoCarrinho').textContent = buscaPrecoProduto(produto.nome);
		carrinhoHTML.appendChild(clon);
	});

	atualizaInputsIcones();

	// inserção da linha que exibe o subtotal
	let clon = document.querySelector('#linhaSubtotal').content.cloneNode(true);
	clon.querySelector('td').textContent = `R$${calculaSubtotal(carrinho)}`;
	carrinhoHTML.appendChild(clon);
};

const calculaSubtotal = (carrinho) => {
	let subtotal = 0;
	for (let i = 0; i < carrinho.length; i++) {
		subtotal += carrinho[i].quantidade * buscaPrecoProduto(carrinho[i].nome);
	}

	return subtotal;
};

const removeProdutoCarrinho = (carrinho, nome) => {
	for (let i = 0; i < carrinho.length; i++) {
		if (carrinho[i].nome === nome) {
			carrinho.splice(i, 1);
		}
	}

	atualizaCarrinho(carrinho);
};

const atualizaInputsIcones = () => {
	let inputs = [... document.querySelectorAll('[name="quantidade"]')];
	inputs.forEach(input => {
		input.addEventListener('change', () => {
			let produto = input.getAttribute('data-product');
			let quantidade = parseInt(input.value);
			if (quantidade > 0) {
				alteraQuantidadeProduto(carrinho, produto, quantidade);
			} else if (quantidade === 0) {
				removeProdutoCarrinho(carrinho, produto);
			} else {
				input.value = 1;
			}
		});
	});

	let icones = [... document.querySelectorAll('.removerProduto')];
	icones.forEach(icone => {
		icone.addEventListener('click', () => {
			let produto = icone.getAttribute('data-product');
			removeProdutoCarrinho(carrinho, produto);
		});
	});
};

botoesCompra.forEach(botaoCompra => {
	botaoCompra.addEventListener('click', () => {
		let produto = botaoCompra.getAttribute('data-product');
		if (!produtoNoCarrinho(carrinho, produto)) {
			carrinho.push(objProduto(produto, 1));
			atualizaCarrinho(carrinho);
		}
	});
});

// Finalizar compra
const btnFinalizarCompra = document.querySelector('#btnFinalizarCompra');
btnFinalizarCompra.addEventListener('click', () => {
	fetch('http://localhost:3000/checkout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(carrinho)
	}).then(res => {
		if (res.ok) return res.json();
		return res.json().then(json => Promise.reject(json));
	}).then(({ url }) => {
		window.location = url;
	}).catch(e => {
		console.error(e.error);
	});
});