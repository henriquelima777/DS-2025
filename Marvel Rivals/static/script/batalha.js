const herois = [
    { nome: "Homem de Ferro", vida: 120, imagem: "/static/assets/homemdeferro.png", ataques: [
        { nome: "Rajada Repulsora", dano: 40 },
        { nome: "Míssil", dano: 30 }
    ]},
    { nome: "Capitão América", vida: 130, imagem: "/static/assets/capitaoamerica.png", ataques: [
        { nome: "Lançamento de Escudo", dano: 40 },
        { nome: "Soco de Super Soldado", dano: 30 }
    ]},
    { nome: "Pantera Negra", vida: 120, imagem: "/static/assets/panteranegra.png", ataques: [
        { nome: "Chute Acrobático", dano: 50 },
        { nome: "Garras de Vibranium", dano: 30 }
    ]},
    { nome: "Feiticeira Escarlate", vida: 110, imagem: "/static/assets/feiticeiraescarlate.png", ataques: [
        { nome: "Explosão Caótica", dano: 50 },
        { nome: "Onda de Energia", dano: 40 }
    ]}
];

const viloes = [
    { nome: "Caveira Vermelha", vida: 120, imagem: "/static/assets/caveiravermelha.png", ataques: [
        { nome: "Tiro da Hidra", dano: 40 },
        { nome: "Soco Brutal", dano: 30 }
    ]},
    { nome: "Loki", vida: 110, imagem: "/static/assets/loki.png", ataques: [
        { nome: "Adaga de Loki", dano: 40 },
        { nome: "Golpe Sombrio", dano: 30 }
    ]},
    { nome: "Ultron", vida: 130, imagem: "/static/assets/ultron.png", ataques: [
        { nome: "Rajada de Energia", dano: 50 },
        { nome: "Golpe Robótico", dano: 40 }
    ]},
    { nome: "Thanos", vida: 150, imagem: "/static/assets/thanos.png", ataques: [
        { nome: "Punho Titânico", dano: 60 },
        { nome: "Golpe Cósmico", dano: 50 }
    ]}
];

const deckEscolhido = localStorage.getItem('deckEscolhido');
const jogadorDeck = deckEscolhido === 'herois' ? [...herois] : [...viloes];
const inimigoDeck = deckEscolhido === 'herois' ? [...viloes] : [...herois];
let cartaJogadorEmCampo = null;
let cartaInimigoEmCampo = null;

const maoJogador = document.getElementById('mao-jogador');
const maoInimigo = document.getElementById('mao-inimigo');
const campoJogador = document.getElementById('campo-jogador');
const campoInimigo = document.getElementById('campo-inimigo');

jogadorDeck.forEach((carta) => {
    const img = document.createElement('img');
    img.src = carta.imagem;
    img.addEventListener('click', (e) => {
        const clickedIndex = Array.from(maoJogador.children).indexOf(e.target);
        jogarCartaJogador(clickedIndex);
    });
    maoJogador.appendChild(img);
});

inimigoDeck.forEach(() => {
    const img = document.createElement('img');
    img.src = '/static/assets/verso-carta.png';
    maoInimigo.appendChild(img);
});

function jogarCartaJogador(index) {
    if (cartaJogadorEmCampo || !jogadorDeck[index]) return;

    const carta = jogadorDeck.splice(index, 1)[0];
    maoJogador.removeChild(maoJogador.children[index]);
    cartaJogadorEmCampo = { ...carta };

campoJogador.innerHTML = `
    <div class="entrada-carta">
        <img src="${carta.imagem}" class="carta-img">
        <div class="barra-vida-container">
            <div class="barra-vida" id="barra-jogador" style="width: 100%;"></div>
            <div class="valor-vida" id="hp-jogador">${carta.vida}</div>
        </div>
        <button class="botao-ataque0" onclick="atacar(0)">${carta.ataques[0].nome} (${carta.ataques[0].dano})</button>
        <button class="botao-ataque1" onclick="atacar(1)">${carta.ataques[1].dano})</button>
    </div>
`;



    console.log(`Jogador jogou: ${carta.nome}`);

    setTimeout(jogadaInimigo, 1000);
}

function jogadaInimigo() {
    if (cartaInimigoEmCampo || inimigoDeck.length === 0) return;

    const index = Math.floor(Math.random() * inimigoDeck.length);
    const carta = inimigoDeck.splice(index, 1)[0];
    maoInimigo.removeChild(maoInimigo.children[index]);
    cartaInimigoEmCampo = { ...carta };

campoInimigo.innerHTML = `
    <div class="entrada-carta">
        <img src="${carta.imagem}" class="carta-img">
        <div class="barra-vida-container">
            <div class="barra-vida" id="barra-inimigo" style="width: 100%;"></div>
            <div class="valor-vida" id="hp-inimigo">${carta.vida}</div>
        </div>
    </div>
`;

    console.log(`Inimigo jogou: ${carta.nome}`);
}

function atacar(indiceAtaque) {
    if (!cartaJogadorEmCampo || !cartaInimigoEmCampo) return;

    const ataque = cartaJogadorEmCampo.ataques[indiceAtaque];
    cartaInimigoEmCampo.vida -= ataque.dano;

    if (cartaInimigoEmCampo.vida < 0) cartaInimigoEmCampo.vida = 0;
    document.getElementById('hp-inimigo').textContent = cartaInimigoEmCampo.vida;
    const percent = (cartaInimigoEmCampo.vida / 150) * 100;
    document.getElementById('barra-inimigo').style.width = percent + '%';

    campoInimigo.querySelector('.carta-img').classList.add('dano');

    setTimeout(() => {
        campoInimigo.querySelector('.carta-img').classList.remove('dano');
    }, 300);

    console.log(`Jogador usou ${ataque.nome}, causou ${ataque.dano} de dano no inimigo (${cartaInimigoEmCampo.nome}). HP restante: ${cartaInimigoEmCampo.vida}`);

    if (cartaInimigoEmCampo.vida <= 0) {
        console.log(`${cartaInimigoEmCampo.nome} foi derrotado!`);
        campoInimigo.innerHTML = '';
        cartaInimigoEmCampo = null;
        checarFimDeJogo();
        if (inimigoDeck.length > 0) {
            setTimeout(jogadaInimigo, 1000);
        }
        return;
    }

    setTimeout(() => ataqueInimigo(), 1000);
}

function ataqueInimigo() {
    if (!cartaInimigoEmCampo || !cartaJogadorEmCampo) return;

    const ataque = cartaInimigoEmCampo.ataques[Math.floor(Math.random() * 2)];
    cartaJogadorEmCampo.vida -= ataque.dano;

    if (cartaJogadorEmCampo.vida < 0) cartaJogadorEmCampo.vida = 0;
    document.getElementById('hp-jogador').textContent = cartaJogadorEmCampo.vida;
    const percent = (cartaJogadorEmCampo.vida / 150) * 100;
    document.getElementById('barra-jogador').style.width = percent + '%';

    campoJogador.querySelector('.carta-img').classList.add('dano');

    setTimeout(() => {
        campoJogador.querySelector('.carta-img').classList.remove('dano');
    }, 300);

    console.log(`Inimigo usou ${ataque.nome}, causou ${ataque.dano} de dano no jogador (${cartaJogadorEmCampo.nome}). HP restante: ${cartaJogadorEmCampo.vida}`);

    if (cartaJogadorEmCampo.vida <= 0) {
        console.log(`${cartaJogadorEmCampo.nome} foi derrotado!`);
        campoJogador.innerHTML = '';
        cartaJogadorEmCampo = null;
        checarFimDeJogo();
    }
}

function checarFimDeJogo() {
    const cartasRestantesJogador = jogadorDeck.length;
    const cartasRestantesInimigo = inimigoDeck.length;

    if (!cartaJogadorEmCampo && cartasRestantesJogador === 0) {
        setTimeout(() => alert('DERROTA! O inimigo venceu. 😭'), 500);
        console.log('Fim de jogo: DERROTA!');
    }

    if (!cartaInimigoEmCampo && cartasRestantesInimigo === 0) {
        setTimeout(() => alert('VITÓRIA! Você venceu. 🎉'), 500);
        console.log('Fim de jogo: VITÓRIA!');
    }
}
