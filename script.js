const startScreen = document.getElementById("startScreen");
const playBtn = document.getElementById("playBtn");
const quizContainer = document.getElementById("quizContainer");
const questionText = document.getElementById("questionText");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
let perguntaAtual = 0;
let pontuacao = 0;
let nomeJogador = "";
let respostasUsuario = [];

const perguntas = [
  {
    pergunta: "Qual é a chance de sair cara em uma única jogada de uma moeda?",
    respostas: ["0%", "25%", "50%", "75%"],
    correta: 2,
  },
  {
    pergunta:
      "Se um dado tem 6 faces, qual é a probabilidade de sair o número 4?",
    respostas: ["1 em 3", "1 em 4", "1 em 6", "1 em 2"],
    correta: 2,
  },
  {
    pergunta:
      "Qual é a chance de tirar uma carta de copas de um baralho comum com 52 cartas?",
    respostas: ["13 em 52", "4 em 52", "1 em 13", "26 em 52"],
    correta: 0,
  },
  {
    pergunta:
      "Em uma roleta com 8 cores diferentes, qual a chance de cair em uma cor específica?",
    respostas: ["1 em 4", "1 em 8", "1 em 2", "2 em 3"],
    correta: 1,
  },
  {
    pergunta:
      "Qual a probabilidade de sair um número par ao lançar um dado de 6 lados?",
    respostas: ["2 em 6", "1 em 6", "3 em 6", "5 em 6"],
    correta: 2,
  },
  {
    pergunta:
      "Em um sorteio com 10 números diferentes, qual é a chance de acertar um número?",
    respostas: ["2 em 10", "1 em 10", "5 em 10", "10 em 10"],
    correta: 1,
  },
  {
    pergunta:
      "Se um jogo tem 3 portas e apenas uma tem o prêmio, qual é a chance de acertar de primeira?",
    respostas: ["50%", "1 em 3", "1 em 2", "2 em 3"],
    correta: 1,
  },
  {
    pergunta:
      "Se a probabilidade de um evento acontecer é de 20%, qual é a probabilidade dele não acontecer?",
    respostas: ["80%", "90%", "70%", "50%"],
    correta: 0,
  },
  {
    pergunta:
      "Se você tem uma chance de 1 em 1000 de ganhar um prêmio, qual é a probabilidade de não ganhar?",
    respostas: ["99%", "100%", "98%", "90%"],
    correta: 0,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start-button").addEventListener("click", startQuiz);
  document
    .getElementById("next-button")
    .addEventListener("click", nextQuestion);
  document
    .getElementById("restart-button")
    .addEventListener("click", restartQuiz);
  document
    .getElementById("clear-ranking-button")
    .addEventListener("click", clearRanking);

  updateRankingList();
});

function startQuiz() {
  nomeJogador = document.getElementById("player-name").value.trim();
  if (!nomeJogador) {
    alert("Por favor, digite seu nome!");
    return;
  }

  perguntaAtual = 0;
  pontuacao = 0;
  respostasUsuario = [];

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("feedback").style.display = "none";

  loadQuestion();
}

function loadQuestion() {
  const pergunta = perguntas[perguntaAtual];
  const questionDiv = document.getElementById("question");
  const optionsDiv = document.getElementById("options");

  questionDiv.textContent = `${perguntaAtual + 1}. ${pergunta.pergunta}`;
  optionsDiv.innerHTML = "";

  pergunta.respostas.forEach((resposta, index) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="q${perguntaAtual}" value="${index}"> ${resposta}`;
    optionsDiv.appendChild(label);
  });

  document.getElementById("next-button").style.display = "none";

  document
    .querySelectorAll(`input[name="q${perguntaAtual}"]`)
    .forEach((input) => {
      input.addEventListener("change", () => {
        document.getElementById("next-button").style.display = "block";
      });
    });
}

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

  if (respostaSelecionada === respostaCorreta) {
    pontuacao++;
  }

  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("final-name").textContent = nomeJogador;
  document.getElementById(
    "final-score"
  ).textContent = `${pontuacao} de ${perguntas.length}`;

  let mensagem = "";
  if (pontuacao === perguntas.length) {
    mensagem = "Parabéns! Você acertou tudo!";
  } else if (pontuacao >= perguntas.length / 2) {
    mensagem = "Bom trabalho! Continue praticando.";
  } else {
    mensagem = "Não desanime! Tente novamente.";
  }
  document.getElementById("mensagem-final").textContent = mensagem;

  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome: nomeJogador, pontuacao });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  localStorage.setItem("ranking", JSON.stringify(ranking));

  updateRankingList();
  showFeedback();
}

function showFeedback() {
  const feedbackList = document.getElementById("feedback-list");
  feedbackList.innerHTML = "";
  document.getElementById("feedback").style.display = "block";

  respostasUsuario.forEach((resposta, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
                    <strong>${index + 1}. ${resposta.pergunta}</strong><br>
                    Sua resposta: <span style="color: ${
                      resposta.acertou ? "green" : "red"
                    }; font-weight: bold;">
                        ${resposta.escolhida}
                    </span><br>
                    Resposta correta: <strong>${resposta.correta}</strong>
                `;
    feedbackList.appendChild(li);
  });
}

function updateRankingList() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  ranking.slice(0, 40).forEach((item, index) => {
    const li = document.createElement("li");

    // Medalhas para os 3 primeiros
    let medalha = "";
    if (index === 0) medalha = "🥇 ";
    else if (index === 1) medalha = "🥈 ";
    else if (index === 2) medalha = "🥉 ";

    li.textContent = `${medalha}${index + 1}. ${item.nome} - ${
      item.pontuacao
    } pts`;
    rankingList.appendChild(li);
  });
}

function restartQuiz() {
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("feedback").style.display = "none";
  document.getElementById("player-name").value = "";
}

function clearRanking() {
  if (confirm("Deseja realmente apagar o ranking?")) {
    localStorage.removeItem("ranking");
    updateRankingList();
  }
}
