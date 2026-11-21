const termos = [
  { id: "cpu", sigla: "CPU", pista: "Busca e executa as instruções do computador." },
  { id: "ula", sigla: "ULA", pista: "Faz as contas e as operações lógicas dentro do processador." },
  { id: "uc", sigla: "UC", pista: "Lê cada instrução e dá as ordens aos outros componentes." },
  { id: "registrador", sigla: "Registrador", pista: "Memória minúscula e muito rápida dentro da CPU; o acumulador é um exemplo." },
  { id: "ram", sigla: "RAM", pista: "Memória de trabalho, volátil: guarda programas em execução e seus dados." },
  { id: "rom", sigla: "ROM", pista: "Memória não volátil que guarda o firmware do equipamento." },
  { id: "eeprom", sigla: "EEPROM", pista: "Memória pequena do Arduino cujos dados sobrevivem ao desligamento." },
  { id: "flash", sigla: "Flash", pista: "Mesma tecnologia do pendrive; guarda o programa do Arduino." },
  { id: "cache", sigla: "Cache", pista: "Guarda cópia do que a CPU usou há pouco, para acesso veloz." },
  { id: "dma", sigla: "DMA", pista: "Um controlador copia dados entre dispositivo e memória sem a CPU mover cada byte." }
];

const tabuleiro = document.getElementById("tabuleiro");
const elPares = document.getElementById("pares");
const elTentativas = document.getElementById("tentativas");
const elMensagem = document.getElementById("mensagem");

let primeira = null;
let travado = false;
let pares = 0;
let tentativas = 0;

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function criarCarta(termo, tipo) {
  const carta = document.createElement("button");
  carta.type = "button";
  carta.className = "carta";
  carta.dataset.id = termo.id;
  carta.setAttribute("aria-label", "Carta virada para baixo");

  const texto = tipo === "sigla" ? termo.sigla : termo.pista;
  carta.innerHTML =
    '<div class="lado costas" aria-hidden="true">?</div>' +
    '<div class="lado frente ' + tipo + '"></div>';
  carta.querySelector(".frente").textContent = texto;

  carta.addEventListener("click", () => virar(carta));
  return carta;
}

function atualizarPlacar() {
  elPares.textContent = pares + " de " + termos.length + " pares";
  elTentativas.textContent = tentativas + (tentativas === 1 ? " tentativa" : " tentativas");
}

function virar(carta) {
  if (travado || carta.classList.contains("virada")) return;
  carta.classList.add("virada");
  carta.setAttribute("aria-label", carta.querySelector(".frente").textContent);

  if (!primeira) {
    primeira = carta;
    return;
  }

  tentativas++;
  const segunda = carta;

  if (primeira.dataset.id === segunda.dataset.id) {
    primeira.classList.add("certa");
    segunda.classList.add("certa");
    primeira = null;
    pares++;
    atualizarPlacar();
    if (pares === termos.length) {
      elMensagem.textContent = "Você completou o jogo em " + tentativas + " tentativas!";
    }
  } else {
    travado = true;
    atualizarPlacar();
    setTimeout(() => {
      [primeira, segunda].forEach((c) => {
        c.classList.remove("virada");
        c.setAttribute("aria-label", "Carta virada para baixo");
      });
      primeira = null;
      travado = false;
    }, 1000);
  }
}

function iniciar() {
  tabuleiro.innerHTML = "";
  primeira = null;
  travado = false;
  pares = 0;
  tentativas = 0;
  elMensagem.textContent = "";

  const cartas = [];
  termos.forEach((t) => {
    cartas.push(criarCarta(t, "sigla"));
    cartas.push(criarCarta(t, "pista"));
  });
  embaralhar(cartas).forEach((c) => tabuleiro.appendChild(c));
  atualizarPlacar();
}

document.getElementById("reiniciar").addEventListener("click", iniciar);
iniciar();
