// Dados do cardápio
const menu = [
    { id: 1, nome: "Frango empanado,Arroz,Feijao e Batata-Frita", preco: 25.00, imagem: "./imagem/almoco.jpg" }
];

// Array para armazenar o pedido
let pedido = [];

// Função para renderizar o cardápio
function renderMenu() {
    const menuDiv = document.querySelector('.menu-items');
    menuDiv.innerHTML = ""; // Limpa o conteúdo antes de renderizar

    menu.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');

        const img = document.createElement('img');
        img.src = item.imagem;
        img.alt = item.nome;
        img.classList.add('menu-imagem');

        const detalhesDiv = document.createElement('div');
        detalhesDiv.classList.add('menu-detalhes');

        const nome = document.createElement('h3');
        nome.textContent = item.nome;

        const preco = document.createElement('p');
        preco.textContent = `R$${item.preco.toFixed(2)}`;

        const botao = document.createElement('button');
        botao.textContent = "Adicionar";
        botao.onclick = () => adicionarItem(item.id);

        detalhesDiv.appendChild(nome);
        detalhesDiv.appendChild(preco);
        detalhesDiv.appendChild(botao);

        itemDiv.appendChild(img);
        itemDiv.appendChild(detalhesDiv);
        menuDiv.appendChild(itemDiv);
    });
}

// Função para adicionar item ao pedido
function adicionarItem(id) {
    const item = menu.find(produto => produto.id === id);
    pedido.push(item);
    renderPedido();
}

// Função para remover itens do pedido
function removerItem(nome) {
    // Remove todos os itens com o nome especificado
    pedido = pedido.filter(item => item.nome !== nome);
    renderPedido();
}

// Função para renderizar o pedido
function renderPedido() {
    const pedidoLista = document.getElementById('pedido-lista');
    pedidoLista.innerHTML = "";

    // Usando map para criar uma lista de nomes
    const nomes = pedido.map(item => item.nome);

    // Usando filter para evitar duplicatas
    const nomesUnicos = nomes.filter((nome, index) => nomes.indexOf(nome) === index);

    // Usando reduce para contar a quantidade de cada item
    const resumoPedido = nomesUnicos.map(nome => {
        const quantidade = pedido.reduce((acc, item) => {
            return item.nome === nome ? acc + 1 : acc;
        }, 0);
        const precoItem = menu.find(item => item.nome === nome).preco;
        const imagem = menu.find(item => item.nome === nome).imagem;
        return { nome, quantidade, precoItem, imagem };
    });

    // Renderizando os itens
    resumoPedido.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('pedido-item');

        const img = document.createElement('img');
        img.src = item.imagem;
        img.alt = item.nome;
        img.classList.add('pedido-imagem');

        const detalhes = document.createElement('div');
        detalhes.classList.add('pedido-detalhes');

        const nomeSpan = document.createElement('span');
        nomeSpan.textContent = `${item.nome} x${item.quantidade}`;

        const precoSpan = document.createElement('span');
        precoSpan.textContent = `R$${(item.precoItem * item.quantidade).toFixed(2)}`;

        // Criando o botão de remoção
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remover";
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = () => removerItem(item.nome);

        detalhes.appendChild(nomeSpan);
        detalhes.appendChild(precoSpan);
        detalhes.appendChild(removeBtn);

        li.appendChild(img);
        li.appendChild(detalhes);
        pedidoLista.appendChild(li);
    });

    // Calculando o total usando reduce
    const total = pedido.reduce((acc, item) => acc + item.preco, 0);
    document.getElementById('total').textContent = `Total: R$${total.toFixed(2)}`;
}

// Função para enviar o pedido via WhatsApp
function enviarPedido() {
    if (pedido.length === 0) {
        alert("Seu pedido está vazio!");
        return;
    }

    // Criando a mensagem do pedido
    const nomes = pedido.map(item => item.nome);
    const nomesUnicos = nomes.filter((nome, index) => nomes.indexOf(nome) === index);

    const resumoPedido = nomesUnicos.map(nome => {
        const quantidade = pedido.reduce((acc, item) => {
            return item.nome === nome ? acc + 1 : acc;
        }, 0);
        return `${nome} x${quantidade}`;
    });

    const total = pedido.reduce((acc, item) => acc + item.preco, 0).toFixed(2);

    const mensagem = `Olá, gostaria de fazer o seguinte pedido:\n\n${resumoPedido.join('\n')}\n\nTotal: R$${total}`;

    // Número do WhatsApp com código do país (ex: Brasil +55)
    const numeroWhatsApp = "5511989164348"; // Substitua pelo número desejado

    // Codificando a mensagem
    const mensagemURL = encodeURIComponent(mensagem);

    // URL para enviar a mensagem via WhatsApp
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagemURL}`;

    // Abrindo o WhatsApp
    window.open(url, '_blank');
}

// Evento para o botão de enviar
document.getElementById('btn-enviar').addEventListener('click', enviarPedido);

// Renderizando o cardápio ao carregar a página
document.addEventListener('DOMContentLoaded', renderMenu);
