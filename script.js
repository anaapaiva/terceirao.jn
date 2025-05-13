let perguntaAtual = 0;
let pontuacao = 0;
let nomeJogador = "";

const perguntas = [
  { pergunta: "Qual é a chance de sair cara em uma única jogada de uma moeda?", respostas: ["0%", "25%", "50%", "75%"], correta: 2 },
  { pergunta: "Se um dado tem 6 faces, qual é a probabilidade de sair o número 4?", respostas: ["1 em 3", "1 em 4", "1 em 6", "1 em 2"], correta: 2 },
  { pergunta: "Qual é a chance de tirar uma carta de copas de um baralho comum com 52 cartas?", respostas: ["13 em 52", "4 em 52", "1 em 13", "26 em 52"], correta: 0 },
  { pergunta: "Em uma roleta com 8 cores diferentes, qual a chance de cair em uma cor específica?", respostas: ["1 em 4", "1 em 8", "1 em 2", "2 em 3"], correta: 1 },
  { pergunta: "Qual a probabilidade de sair um número par ao lançar um dado de 6 lados?", respostas: ["2 em 6", "1 em 6", "3 em 6", "5 em 6"], correta: 2 },
  { pergunta: "Em um sorteio com 10 números diferentes, qual é a chance de acertar um número?", respostas: ["2 em 10", "1 em 10", "5 em 10", "10 em 10"], correta: 1 },
  { pergunta: "Se um jogo tem 3 portas e apenas uma tem o prêmio, qual é a chance de acertar de primeira?", respostas: ["50%", "1 em 3", "1 em 2", "2 em 3"], correta: 1 },
  { pergunta: "Se a probabilidade de um evento acontecer é de 20%, qual é a probabilidade dele não acontecer?", respostas: ["80%", "90%", "70%", "50%"], correta: 0 },
  { pergunta: "Se você tem uma chance de 1 em 1000 de ganhar um prêmio, qual é a probabilidade de não ganhar?", respostas: ["99%", "100%", "98%", "90%"], correta: 0 }
];

const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const playerNameInput = document.getElementById('player-name');
const rankingList = document.getElementById('ranking-list');
const questionDiv = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const resultDiv = document.getElementById('result');
const quizContainer = document.getElementById('quiz-container');
const startScreen = document.getElementById('start-screen');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
  nomeJogador = playerNameInput.value.trim();
  if (!nomeJogador) {
    alert('Por favor, digite seu nome!');
    return;
  }
  startScreen.style.display = 'none';
  quizContainer.style.display = 'block';
  loadQuestion();
}

function loadQuestion() {
  const pergunta = perguntas[perguntaAtual];
  questionDiv.textContent = `${perguntaAtual + 1}. ${pergunta.pergunta}`;
  optionsDiv.innerHTML = '';
  pergunta.respostas.forEach((resposta, index) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="q${perguntaAtual}" value="${index}"> ${resposta}`;
    optionsDiv.appendChild(label);
  });
  nextButton.style.display = 'none';
  document.querySelectorAll('input[name="q' + perguntaAtual + '"]').forEach(input => {
    input.addEventListener('change', () => {
      nextButton.style.display = 'block';
    });
  });
}

function nextQuestion() {
  const selectedOption = document.querySelector('input[name="q' + perguntaAtual + '"]:checked');
  if (!selectedOption) {
    alert('Por favor, selecione uma resposta!');
    return;
  }

  const respostaCorreta = perguntas[perguntaAtual].correta;
  const respostaSelecionada = parseInt(selectedOption.value);

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
  quizContainer.style.display = 'none';
  resultDiv.style.display = 'block';
  document.getElementById('final-name').textContent = nomeJogador;
  document.getElementById('final-score').textContent = `${pontuacao} de ${perguntas.length}`;

  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ nome: nomeJogador, pontuacao });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  localStorage.setItem('ranking', JSON.stringify(ranking));

  updateRankingList();
}

function updateRankingList() {
  rankingList.innerHTML = '';
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.slice(0, 10).forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.nome}: ${player.pontuacao}`;
    rankingList.appendChild(li);
  });
}

function restartQuiz() {
  perguntaAtual = 0;
  pontuacao = 0;
  resultDiv.style.display = 'none';
  startScreen.style.display = 'block';
  playerNameInput.value = '';
}

function clearRanking() {
  localStorage.removeItem('ranking');
  updateRankingList();
}
