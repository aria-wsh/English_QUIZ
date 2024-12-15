// 單字資料
const vocabularyData = [
    { word: "a", options: ["一(個)", "二(個)", "三(個)", "四(個)"], correct: 0 },
    { word: "A.M.", options: ["上午", "下午", "晚上", "凌晨"], correct: 0 },
    { word: "abandon", options: ["拋棄", "保持", "擁抱", "珍惜"], correct: 0 },
    { word: "abbey", options: ["大修道院", "小學校", "購物中心", "運動場"], correct: 0 },
    { word: "abbreviate", options: ["縮寫", "延長", "擴展", "重複"], correct: 0 },
    { word: "abbreviation", options: ["縮寫", "全稱", "註解", "標題"], correct: 0 },
    { word: "abdomen", options: ["腹部", "手臂", "頭部", "腿部"], correct: 0 },
    { word: "abide", options: ["容忍", "反抗", "逃避", "放棄"], correct: 0 },
    { word: "ability", options: ["能力", "困難", "問題", "障礙"], correct: 0 },
    { word: "able", options: ["能夠的", "無能的", "困難的", "不可能的"], correct: 0 },
    { word: "abnormal", options: ["不正常的", "正常的", "普通的", "平凡的"], correct: 0 },
    { word: "aboard", options: ["在交通工具上", "在地面上", "在空中", "在水中"], correct: 0 },
    { word: "abolish", options: ["廢除", "建立", "保持", "加強"], correct: 0 },
    { word: "aboriginal", options: ["土著的", "外來的", "現代的", "都市的"], correct: 0 },
    { word: "abortion", options: ["流產", "懷孕", "分娩", "哺乳"], correct: 0 },
    { word: "about", options: ["關於", "遠離", "反對", "背離"], correct: 0 },
    { word: "above", options: ["在上面", "在下面", "在旁邊", "在中間"], correct: 0 },
    { word: "abroad", options: ["在國外", "在國內", "在家裡", "在辦公室"], correct: 0 },
    { word: "abrupt", options: ["突然的", "緩慢的", "平穩的", "漸進的"], correct: 0 },
    { word: "absence", options: ["缺席", "出席", "參與", "加入"], correct: 0 }
];

// 打亂題目順序的函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let currentWord = 0;
let score = 0;
let timer;
let timeLeft;
let canAnswer = true;
let shuffledQuestions = [];

// DOM elements
const wordEl = document.getElementById('word');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const speakBtn = document.getElementById('speak-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const quizContainer = document.getElementById('quiz-container');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// 語音合成
const speech = window.speechSynthesis;

// 載入單字
function loadWord() {
    if (currentWord === 0) {
        // 開始新的測驗時打亂題目順序
        shuffledQuestions = shuffleArray([...vocabularyData]);
    }
    
    const currentVocab = shuffledQuestions[currentWord];
    wordEl.textContent = currentVocab.word;
    
    optionsEl.innerHTML = '';
    currentVocab.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsEl.appendChild(button);
    });
    
    canAnswer = true;
    feedbackEl.className = 'hidden';
    nextBtn.className = 'hidden';
    startTimer();
}

// 計時器
function startTimer() {
    timeLeft = 15;
    timerEl.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

// 時間到
function timeUp() {
    if (!canAnswer) return;
    canAnswer = false;
    clearInterval(timer);
    
    const correctAnswer = shuffledQuestions[currentWord].options[shuffledQuestions[currentWord].correct];
    feedbackEl.textContent = `時間到！正確答案是：${correctAnswer}`;
    feedbackEl.className = 'wrong';
    
    showNextButton();
}

// 選擇答案
function selectOption(index) {
    if (!canAnswer) return;
    canAnswer = false;
    clearInterval(timer);
    
    const options = document.querySelectorAll('.option');
    const correctIndex = shuffledQuestions[currentWord].correct;
    
    options[correctIndex].classList.add('correct');
    if (index !== correctIndex) {
        options[index].classList.add('wrong');
        feedbackEl.textContent = '答錯了！';
        feedbackEl.className = 'wrong';
    } else {
        score++;
        feedbackEl.textContent = '答對了！';
        feedbackEl.className = 'correct';
    }
    
    showNextButton();
}

// 顯示下一題按鈕
function showNextButton() {
    feedbackEl.classList.remove('hidden');
    if (currentWord < shuffledQuestions.length - 1) {
        nextBtn.textContent = '下一題';
        nextBtn.onclick = nextWord;
    } else {
        nextBtn.textContent = '查看結果';
        nextBtn.onclick = showResult;
    }
    nextBtn.classList.remove('hidden');
}

// 下一題
function nextWord() {
    currentWord++;
    loadWord();
}

// 顯示結果
function showResult() {
    quizContainer.classList.add('hidden');
    resultEl.classList.remove('hidden');
    scoreEl.textContent = `${score}/${shuffledQuestions.length}`;
}

// 重新開始
restartBtn.onclick = () => {
    currentWord = 0;
    score = 0;
    quizContainer.classList.remove('hidden');
    resultEl.classList.add('hidden');
    loadWord();
};

// 發音功能
speakBtn.onclick = () => {
    const utterance = new SpeechSynthesisUtterance(shuffledQuestions[currentWord].word);
    utterance.lang = 'en-US';
    speech.speak(utterance);
};

// 開始測驗
loadWord();
