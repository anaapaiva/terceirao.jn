const startScreen = document.getElementById("start-screen");
const playBtn = document.getElementById("start-button");
const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question");
const answersDiv = document.getElementById("options");
const nextBtn = document.getElementById("next-button");
const timerCorner = document.getElementById("timer-corner");

let perguntaAtual = 0;
let pontuacao = 0;
let nomeJogador = "";
let respostasUsuario = [];
let timerInterval;
let timeLeft = 150; // 2 minutos e meio

let perguntas = [
  {
    pergunta: "Quantos segundos tem em um dia?",
    respostas: ["60.000", "86.400", "100.000", "72.800"],
    correta: 1,
  },
  {
    pergunta:
      "Ana Luíza trabalha 8 horas por dia em escala 6×1. Considerando um ano com 52 semanas e que ela terá 1 mês de folga equivalente a 4 semanas, quantas horas ela trabalhará nesse ano?",
    respostas: ["2.080", "2.304", "2.600", "2.160"],
    correta: 1,
  },
  {
    pergunta: "Qual número a letra L representa nos algarismos romanos?",
    respostas: ["100", "10", "50", "500"],
    correta: 2,
  },
  {
    pergunta: "Quanto é 30% de 60?",
    respostas: ["12", "15", "18", "20"],
    correta: 2,
  },
  {
    pergunta:
      "Qual a moda da sequência: 35,36,40,40,40,37,37,38,36,36,36,35,34,35,36,37,35,38,35,35,35?",
    respostas: ["36", "37", "35", "40"],
    correta: 2,
  },
  {
    pergunta: "Quanto é a metade de meia década mais 5 anos?",
    respostas: ["10", "5", "7,5", "6"],
    correta: 2,
  },
  {
    pergunta:
      "Quantas formas diferentes pode-se escrever a palavra PROBABILIDADE?",
    respostas: ["19.958.400", "9.979.200", "12.000.000", "15.552.000"],
    correta: 0,
  },
  {
    pergunta:
      "Qual é a chance de tirar uma carta de copas de um baralho comum de 52 cartas?",
    respostas: ["13 em 52", "1 em 26", "1 em 52", "10 em 52"],
    correta: 0,
  },
  {
    pergunta:
      "Uma empresa teve R$19.000,00 de lucro em janeiro. No mês seguinte obteve 15% a mais. Qual foi o lucro em fevereiro?",
    respostas: ["R$ 21.500,00", "R$ 21.850,00", "R$ 21.852,00", "R$ 22.000,00"],
    correta: 2,
  },
  {
    pergunta:
      "Obtenha o valor de M, sabendo que a distância entre os pontos C(+1,-2) e D(m,-2) é 5.",
    respostas: ["M = +6 ou -4", "M = +5 ou -5", "M = +4 ou -6", "M = +3 ou -3"],
    correta: 0,
  },
];

// Embaralhar perguntas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  playBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  document
    .getElementById("restart-button")
    .addEventListener("click", restartQuiz);
  document
    .getElementById("clear-ranking-button")
    .addEventListener("click", clearRanking);
  updateRankingList();
});

// Começar quiz
function startQuiz() {
  nomeJogador = document.getElementById("player-name").value.trim();
  if (!nomeJogador) {
    alert("Por favor, digite seu nome!");
    return;
  }

  perguntaAtual = 0;
  pontuacao = 0;
  respostasUsuario = [];
  shuffle(perguntas);

  startScreen.style.display = "none";
  quizContainer.style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("feedback").style.display = "none";

  timeLeft = 120;
  timerCorner.textContent = formatTime(timeLeft);
  startTimer();
  loadQuestion();
}

// Carregar pergunta
function loadQuestion() {
  const pergunta = perguntas[perguntaAtual];
  questionText.textContent = `${perguntaAtual + 1}. ${pergunta.pergunta}`;
  answersDiv.innerHTML = "";

  pergunta.respostas.forEach((resposta, index) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="q${perguntaAtual}" value="${index}"> ${resposta}`;
    answersDiv.appendChild(label);
  });

  nextBtn.style.display = "none";

  const radios = document.querySelectorAll(`input[name="q${perguntaAtual}"]`);
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      nextBtn.style.display = "block";
    });
  });
}

// Próxima pergunta
function nextQuestion() {
  const selectedOption = document.querySelector(
    `input[name="q${perguntaAtual}"]:checked`
  );
  if (!selectedOption) {
    alert("Por favor, selecione uma resposta!");
    return;
  }

  const respostaSelecionada = parseInt(selectedOption.value);
  const respostaCorreta = perguntas[perguntaAtual].correta;

  respostasUsuario.push({
    pergunta: perguntas[perguntaAtual].pergunta,
    correta: perguntas[perguntaAtual].respostas[respostaCorreta],
    escolhida: perguntas[perguntaAtual].respostas[respostaSelecionada],
    acertou: respostaSelecionada === respostaCorreta,
  });

  if (respostaSelecionada === respostaCorreta) pontuacao++;
  perguntaAtual++;

  if (perguntaAtual < perguntas.length) loadQuestion();
  else showResult();
}

// Timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerCorner.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

// Resultado final
function showResult() {
  clearInterval(timerInterval);

  quizContainer.style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("final-name").textContent = nomeJogador;
  document.getElementById(
    "final-score"
  ).textContent = `${pontuacao} de ${perguntas.length}`;

  let mensagem = "";
  if (pontuacao === perguntas.length) mensagem = "Parabéns! Você acertou tudo!";
  else if (pontuacao >= perguntas.length / 2)
    mensagem = "Bom trabalho! Continue praticando.";
  else mensagem = "Não desanime! Tente novamente.";
  document.getElementById("mensagem-final").textContent = mensagem;

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: nomeJogador, pontuacao });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  localStorage.setItem("ranking", JSON.stringify(ranking));

  updateRankingList();
  showFeedback();
}

// Feedback detalhado
function showFeedback() {
  const feedbackList = document.getElementById("feedback-list");
  feedbackList.innerHTML = "";
  document.getElementById("feedback").style.display = "block";

  respostasUsuario.forEach((resposta, index) => {
    const perguntaQuebravel = resposta.pergunta.replace(/,/g, ",\u200B");
    const li = document.createElement("li");
    li.innerHTML = `<strong>${index + 1}. ${perguntaQuebravel}</strong><br>
      Sua resposta: <span style="color:${
        resposta.acertou ? "green" : "red"
      }; font-weight: bold;">${resposta.escolhida}</span><br>
      Resposta correta: <strong>${resposta.correta}</strong>`;
    feedbackList.appendChild(li);
  });
}

// Ranking
function updateRankingList() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  ranking.slice(0, 40).forEach((item, index) => {
    let medalha = "";
    if (index === 0) medalha = "🥇 ";
    else if (index === 1) medalha = "🥈 ";
    else if (index === 2) medalha = "🥉 ";
    const li = document.createElement("li");
    li.textContent = `${medalha}${index + 1}. ${item.nome} - ${
      item.pontuacao
    } pts`;
    rankingList.appendChild(li);
  });
}

// Reiniciar
function restartQuiz() {
  startScreen.style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("feedback").style.display = "none";
  document.getElementById("player-name").value = "";

  clearInterval(timerInterval);
  timeLeft = 150;
  timerCorner.textContent = formatTime(timeLeft);
}

// Limpar ranking
function clearRanking() {
  if (confirm("Deseja realmente apagar o ranking?")) {
    localStorage.removeItem("ranking");
    updateRankingList();
  }
}
