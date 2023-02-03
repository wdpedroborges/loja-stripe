require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const cors = require('cors');
const app = express();

app.use(cors({
	origin: '*'
}));
app.use(express.json());
app.use(express.static('public')); // conteúdo do cliente ficará na pasta "public"

const precos = [{nome: 'Produto 1', preco: 15}, {nome: 'Produto 2', preco: 15}, {nome: 'Produto 3', preco: 15}];
const buscaPrecoProduto = (produto) => {
	let preco = 0;
	precos.forEach(elemento => {
		if (elemento.nome === produto)
			preco = elemento.preco;
			
	});

	return preco;
}

app.post('/checkout', async (req, res) => {
	let produtos = req.body;
	try {
		let produtosMapeados = produtos.map(produto => {
			return {
				price_data: {
					currency: 'brl',
					product_data: {
						name: produto.nome
					},
					unit_amount: parseFloat(buscaPrecoProduto(produto.nome)) * 100
				},
				quantity: produto.quantidade
			};
		});

		console.log(produtosMapeados);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: produtosMapeados,
			success_url: `${process.env.SERVER_URL}/success.html`,
			cancel_url: `${process.env.SERVER_URL}/cancel.html`
		});
		// a sessão gera uma url que deve ser retornada ao usuário
		res.json({ url: session.url })
	} catch(e) {
		console.log(e);
	}
});

// iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
})
