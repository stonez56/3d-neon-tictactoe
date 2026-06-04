/**
 * 3D 霓虹井字棋 - 核心邏輯控制 (JavaScript)
 * 包含：語系切換、3D 傾斜互動、Canvas 粒子背景、Web Audio API 音效合成器、遊戲邏輯與 Minimax AI。
 * 遵循語系規範：註解與文字皆使用繁體中文（或中英雙語對照）。
 */

// ==========================================================================
// 1. 語系與翻譯系統
// ==========================================================================
const i18n = {
    zh: {
        "app-title": "3D 霓虹井字棋",
        "game-mode-label": "遊戲模式",
        "mode-pve": "單人對戰 (AI)",
        "mode-pvp": "雙人對戰",
        "difficulty-label": "AI 難度",
        "diff-easy": "簡單",
        "diff-medium": "中等",
        "diff-hard": "困難",
        "score-p1": "玩家 X",
        "score-draw": "平手",
        "score-p2-ai": "電腦 O",
        "score-p2-human": "玩家 O",
        "status-start": "點擊格子開始遊戲！",
        "status-turn-x": "玩家 X 的回合",
        "status-turn-o": "玩家 O 的回合",
        "status-turn-ai": "電腦正在思考...",
        "status-win-x": "玩家 X 獲勝！ 🎉",
        "status-win-o": "玩家 O 獲勝！ 🎉",
        "status-win-ai": "電腦 O 獲勝！ 🤖",
        "status-draw": "雙方平手！ 🤝",
        "btn-restart": "重新開始",
        "btn-reset-scores": "重設分數",
        "footer-text": "3D 霓虹井字棋 &copy; 2026. 結合 CSS 3D 轉換與 Web Audio API."
    },
    en: {
        "app-title": "3D Neon Tic-Tac-Toe",
        "game-mode-label": "Game Mode",
        "mode-pve": "Single Player (AI)",
        "mode-pvp": "Two Players",
        "difficulty-label": "AI Difficulty",
        "diff-easy": "Easy",
        "diff-medium": "Medium",
        "diff-hard": "Impossible",
        "score-p1": "Player X",
        "score-draw": "Draw",
        "score-p2-ai": "AI O",
        "score-p2-human": "Player O",
        "status-start": "Click a cell to start!",
        "status-turn-x": "Player X's Turn",
        "status-turn-o": "Player O's Turn",
        "status-turn-ai": "AI is thinking...",
        "status-win-x": "Player X Wins! 🎉",
        "status-win-o": "Player O Wins! 🎉",
        "status-win-ai": "AI O Wins! 🤖",
        "status-draw": "It's a Draw! 🤝",
        "btn-restart": "Restart Game",
        "btn-reset-scores": "Reset Scores",
        "footer-text": "3D Neon Tic-Tac-Toe &copy; 2026. Built with CSS 3D & Web Audio API."
    }
};

let currentLang = localStorage.getItem("lang") || "zh";

function updateLanguageUI() {
    const dict = i18n[currentLang];
    
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (dict[key]) {
            // 保留內部 icon (如果有)
            const icon = elem.querySelector("i");
            if (icon) {
                elem.innerHTML = "";
                elem.appendChild(icon);
                elem.appendChild(document.createTextNode(" " + dict[key]));
            } else {
                elem.innerHTML = dict[key];
            }
        }
    });

    // 額外處理分數看板的標題
    const isPVP = document.querySelector('[data-mode="pvp"]').classList.contains("active");
    const p2Label = document.getElementById("label-player-o");
    p2Label.textContent = isPVP ? dict["score-p2-human"] : dict["score-p2-ai"];

    // 更新語系切換按鈕文字 (顯示即將切換至的語系名稱)
    const langBtnText = document.getElementById("lang-text");
    langBtnText.textContent = currentLang === "zh" ? "English" : "繁體中文";
}

// 語系切換監聽
document.getElementById("lang-toggle").addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("lang", currentLang);
    playClickSound();
    updateLanguageUI();
    updateStatusBanner();
});


// ==========================================================================
// 2. Web Audio API 音效合成器
// ==========================================================================
let audioCtx = null;
let isMuted = localStorage.getItem("muted") === "true";

// 初始化音效按鈕狀態
const muteToggleBtn = document.getElementById("mute-toggle");
function updateMuteBtnUI() {
    const icon = muteToggleBtn.querySelector("i");
    if (isMuted) {
        icon.className = "fa-solid fa-volume-xmark";
        muteToggleBtn.style.color = "var(--text-muted)";
    } else {
        icon.className = "fa-solid fa-volume-high";
        muteToggleBtn.style.color = "var(--text-primary)";
    }
}
updateMuteBtnUI();

// 靜音切換監聽
muteToggleBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    localStorage.setItem("muted", isMuted);
    updateMuteBtnUI();
    if (!isMuted) {
        initAudio();
        playClickSound();
    }
});

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 合成短音效
function synthSound(freqs, duration, type = "sine", decay = 0.1) {
    if (isMuted) return;
    initAudio();
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    // 設定頻率包絡
    if (freqs.length === 1) {
        osc.frequency.setValueAtTime(freqs[0], now);
    } else {
        osc.frequency.setValueAtTime(freqs[0], now);
        osc.frequency.exponentialRampToValueAtTime(freqs[1], now + duration);
    }

    // 設定音量包絡
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + decay);
}

function playClickSound() {
    // 輕巧的按鈕點擊聲 (短高音)
    synthSound([800, 1000], 0.08, "triangle", 0.02);
}

function playPlaceXSound() {
    // X 落子音：科技感的上滑音
    synthSound([440, 880], 0.15, "triangle");
}

function playPlaceOSound() {
    // O 落子音：溫和的下滑音
    synthSound([660, 330], 0.15, "sine");
}

function playWinSound() {
    // 獲勝音：明快的上升大調和弦
    if (isMuted) return;
    initAudio();
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
        setTimeout(() => {
            synthSound([freq, freq * 1.05], 0.25, "sine");
        }, index * 100);
    });
}

function playDrawSound() {
    // 平手音：下沉的和弦
    if (isMuted) return;
    initAudio();
    const notes = [220.00, 207.65, 196.00]; // A3, Ab3, G3
    notes.forEach((freq, index) => {
        setTimeout(() => {
            synthSound([freq, freq * 0.9], 0.3, "sawtooth", 0.1);
        }, index * 120);
    });
}


// ==========================================================================
// 3. Canvas 3D 視差背景粒子特效
// ==========================================================================
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 粒子物件定義
class Particle {
    constructor() {
        this.reset();
        // 隨機初始化位置，避免所有粒子從同一個邊界出生
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20; // 從底部滑入
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.6 + 0.2); // 向上飄
        this.speedX = Math.random() * 0.4 - 0.2;
        this.depth = Math.random(); // 3D 深度感 (0 代表背景，1 代表前景)
        this.alpha = Math.random() * 0.5 + 0.2;
        
        // 顏色分布：一部分霓虹藍，一部分霓虹粉
        const isPink = Math.random() > 0.5;
        this.color = isPink ? "255, 0, 127" : "0, 243, 255";
    }

    update() {
        this.y += this.speedY * (1 + this.depth * 0.5); // 前景移動速度快
        this.x += this.speedX;

        // 超出螢幕重設
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        const r = this.size * (0.5 + this.depth * 0.8);
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        
        // 使用深度模擬鏡頭模糊效果 (深度低的比較模糊)
        if (this.depth < 0.3) {
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha * 0.4})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgb(${this.color})`;
        } else {
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // 重置
    }
}

// 產生粒子池
const particleCount = 45;
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// 粒子動畫迴圈
function animateParticles() {
    ctx.fillStyle = "rgba(10, 11, 16, 0.2)"; // 拖曳軌跡效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ==========================================================================
// 4. 3D 遊戲盤面傾斜互動 (CSS 3D Transforms)
// ==========================================================================
const boardScene = document.getElementById("board-scene");
const boardTilt = document.getElementById("board-tilt");

// 桌機滑鼠移動傾斜
boardScene.addEventListener("mousemove", (e) => {
    const rect = boardScene.getBoundingClientRect();
    
    // 計算滑鼠相對於盤面中心點的相對百分比 (-0.5 至 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // 轉換為旋轉角度 (限制在最大正負 25 度內)
    const rotateX = -(y * 32).toFixed(2);
    const rotateY = (x * 32).toFixed(2);
    
    // 套用 CSS 變數
    boardTilt.style.setProperty("--rotate-x", `${rotateX}deg`);
    boardTilt.style.setProperty("--rotate-y", `${rotateY}deg`);
});

// 滑鼠移出時重置傾斜角度，恢復平整狀態
boardScene.addEventListener("mouseleave", () => {
    boardTilt.style.setProperty("--rotate-x", "0deg");
    boardTilt.style.setProperty("--rotate-y", "0deg");
});

// 手機陀螺儀/觸控輔助 (滑動時輕微傾斜)
boardScene.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = boardScene.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        
        // 限制觸控的旋轉角度 (稍微小一點，維持手感穩定)
        const rotateX = -(y * 18).toFixed(2);
        const rotateY = (x * 18).toFixed(2);
        
        boardTilt.style.setProperty("--rotate-x", `${rotateX}deg`);
        boardTilt.style.setProperty("--rotate-y", `${rotateY}deg`);
    }
}, { passive: true });

boardScene.addEventListener("touchend", () => {
    boardTilt.style.setProperty("--rotate-x", "0deg");
    boardTilt.style.setProperty("--rotate-y", "0deg");
});


// ==========================================================================
// 5. 遊戲主邏輯 & AI 對戰
// ==========================================================================
let boardState = Array(9).fill(""); // 棋盤格狀態: "" (空), "X", "O"
let isGameActive = true;
let activePlayer = "X"; // X 永遠先手
let gameMode = "ai"; // "ai" 或 "pvp"
let aiDifficulty = "medium"; // "easy", "medium", "hard"

// 分數紀錄 (從 localStorage 讀取或初始化)
let scores = {
    x: parseInt(localStorage.getItem("score-x")) || 0,
    o: parseInt(localStorage.getItem("score-o")) || 0,
    draw: parseInt(localStorage.getItem("score-draw")) || 0
};

// 獲勝線組合
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫線
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直線
    [0, 4, 8], [2, 4, 6]             // 對角線
];

const cellElements = document.querySelectorAll(".cell-btn");
const statusText = document.getElementById("status-text");

// 更新畫面上的分數板
function updateScoreboardUI() {
    document.getElementById("score-x").textContent = scores.x;
    document.getElementById("score-o").textContent = scores.o;
    document.getElementById("score-draw").textContent = scores.draw;
    
    // 更新發光邊框 (輪到誰，誰的卡片發光)
    document.getElementById("score-card-x").classList.toggle("active", activePlayer === "X" && isGameActive);
    document.getElementById("score-card-o").classList.toggle("active", activePlayer === "O" && isGameActive);
}

// 動態更新狀態列文字
function updateStatusBanner() {
    const dict = i18n[currentLang];
    if (!isGameActive) return; // 獲勝/平手時由判別式自行控制文字

    if (gameMode === "ai" && activePlayer === "O") {
        statusText.textContent = dict["status-turn-ai"];
    } else {
        statusText.textContent = activePlayer === "X" ? dict["status-turn-x"] : dict["status-turn-o"];
    }
}

// 點擊格子處理
function handleCellClick(e) {
    const clickedCell = e.target.closest(".cell-btn");
    if (!clickedCell) return;
    
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    // 若格子已被下過、遊戲已結束、或是輪到 AI 下子，則點擊無效
    if (boardState[clickedCellIndex] !== "" || !isGameActive || (gameMode === "ai" && activePlayer === "O")) {
        return;
    }

    makeMove(clickedCellIndex, activePlayer);
    
    // 若為 AI 模式且遊戲仍繼續，安排 AI 下子
    if (isGameActive && gameMode === "ai" && activePlayer === "O") {
        setTimeout(handleAIMove, 500); // 延遲 500ms 讓體驗更自然
    }
}

// 落子動作
function makeMove(index, player) {
    boardState[index] = player;
    const cell = cellElements[index];
    cell.classList.add("occupied");

    // 建立 3D 棋子 DOM 結構
    const piece = document.createElement("div");
    piece.classList.add("piece", player.toLowerCase());
    cell.appendChild(piece);

    // 播音效
    if (player === "X") {
        playPlaceXSound();
    } else {
        playPlaceOSound();
    }

    checkResult();
}

// 切換玩家回合
function changePlayer() {
    activePlayer = activePlayer === "X" ? "O" : "X";
    updateStatusBanner();
    updateScoreboardUI();
}

// 檢查勝負平手
function checkResult() {
    let roundWon = false;
    let winCombo = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            roundWon = true;
            winCombo = winningConditions[i];
            break;
        }
    }

    const dict = i18n[currentLang];

    if (roundWon) {
        isGameActive = false;
        const winner = boardState[winCombo[0]];
        
        // 得分高亮並寫入紀錄
        if (winner === "X") {
            scores.x++;
            statusText.textContent = dict["status-win-x"];
        } else {
            scores.o++;
            statusText.textContent = gameMode === "ai" ? dict["status-win-ai"] : dict["status-win-o"];
        }
        
        localStorage.setItem("score-x", scores.x);
        localStorage.setItem("score-o", scores.o);
        playWinSound();

        // 幫贏球的格子加上 3D 發光動畫
        winCombo.forEach(idx => {
            cellElements[idx].classList.add("winning-cell", winner === "X" ? "x-win" : "o-win");
        });
        
        updateScoreboardUI();
        return;
    }

    // 判斷平手 (無空網格且無人獲勝)
    const roundDraw = !boardState.includes("");
    if (roundDraw) {
        isGameActive = false;
        scores.draw++;
        localStorage.setItem("score-draw", scores.draw);
        statusText.textContent = dict["status-draw"];
        playDrawSound();
        updateScoreboardUI();
        return;
    }

    // 繼續下一回合
    changePlayer();
}

// ==========================================================================
// 6. AI 決策邏輯 (簡單 / 中等 / 困難 Minimax)
// ==========================================================================
function handleAIMove() {
    if (!isGameActive) return;

    let move;
    if (aiDifficulty === "easy") {
        move = getRandomMove();
    } else if (aiDifficulty === "medium") {
        // 50% 使用 Minimax 最佳解，50% 隨機
        move = Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } else {
        // 困難：百分之百使用最佳解 (無法戰勝)
        move = getBestMove();
    }

    if (move !== undefined && move !== -1) {
        makeMove(move, "O");
    }
}

// 隨機獲取可用空格 (簡單 AI)
function getRandomMove() {
    const available = [];
    boardState.forEach((val, idx) => {
        if (val === "") available.push(idx);
    });
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
}

// 獲取最佳點位 (困難 AI / Minimax)
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    // 優化：當 AI 下第一手棋且盤面全空時，直接下中央 (4) 或隨機下角落，加快遊戲載入速度並增加擬真度
    const emptyCount = boardState.filter(s => s === "").length;
    if (emptyCount === 9) {
        const preferred = [4, 0, 2, 6, 8];
        return preferred[Math.floor(Math.random() * preferred.length)];
    }

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = "O"; // 模擬 AI 下子
            let score = minimax(boardState, 0, false);
            boardState[i] = ""; // 還原
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// 專為 Minimax 提供之模擬勝負判定 (不觸發 UI)
function checkWinnerSim(tempBoard) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (tempBoard[a] !== "" && tempBoard[a] === tempBoard[b] && tempBoard[b] === tempBoard[c]) {
            return tempBoard[a];
        }
    }
    return null;
}

// Minimax 遞迴極大極小演算法
function minimax(tempBoard, depth, isMaximizing) {
    const winner = checkWinnerSim(tempBoard);
    
    // 電腦獲勝分數為正，玩家獲勝分數為負 (減去/加上深度，以追求最快步數獲勝)
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!tempBoard.includes("")) return 0; // 平手

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = "O";
                let score = minimax(tempBoard, depth + 1, false);
                tempBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = "X";
                let score = minimax(tempBoard, depth + 1, true);
                tempBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}


// ==========================================================================
// 7. UI 控制與按鈕事件監聽
// ==========================================================================

// 遊戲模式切換 (單人/雙人)
const modeSelector = document.getElementById("mode-selector");
modeSelector.addEventListener("click", (e) => {
    const btn = e.target.closest(".segment-btn");
    if (!btn || btn.classList.contains("active")) return;

    playClickSound();
    
    // 更新按鈕樣式
    modeSelector.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    gameMode = btn.getAttribute("data-mode");
    
    // 控制難度選擇器之顯示/隱藏
    const diffGroup = document.getElementById("difficulty-group");
    if (gameMode === "pvp") {
        diffGroup.classList.add("hidden");
    } else {
        diffGroup.classList.remove("hidden");
    }

    // 重新設定並更新語系與得分標題
    updateLanguageUI();
    restartGame();
});

// 難度切換
const diffSelector = document.getElementById("difficulty-selector");
diffSelector.addEventListener("click", (e) => {
    const btn = e.target.closest(".segment-btn");
    if (!btn || btn.classList.contains("active")) return;

    playClickSound();
    diffSelector.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    aiDifficulty = btn.getAttribute("data-diff");
    restartGame();
});

// 重新開始單局遊戲
function restartGame() {
    boardState.fill("");
    isGameActive = true;
    activePlayer = "X";

    // 移除所有格子的棋子與贏球標記
    cellElements.forEach(cell => {
        cell.innerHTML = "";
        cell.className = "cell-btn"; // 還原基本類別
    });

    // 觸表格子盤面 3D 旋轉動畫
    const grid = document.getElementById("board-grid");
    grid.classList.remove("reset-animation");
    void grid.offsetWidth; // 強制重繪 (Trigger Reflow)
    grid.classList.add("reset-animation");

    // 延遲移除動畫 class 避免殘留
    setTimeout(() => {
        grid.classList.remove("reset-animation");
    }, 700);

    updateStatusBanner();
    updateScoreboardUI();
}

// 重設所有分數
function resetScores() {
    scores = { x: 0, o: 0, draw: 0 };
    localStorage.removeItem("score-x");
    localStorage.removeItem("score-o");
    localStorage.removeItem("score-draw");
    playClickSound();
    restartGame();
}

// 點擊事件與初始化
cellElements.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

document.getElementById("restart-btn").addEventListener("click", () => {
    playClickSound();
    restartGame();
});

document.getElementById("reset-scores-btn").addEventListener("click", resetScores);

// 初始化執行
updateLanguageUI();
updateStatusBanner();
updateScoreboardUI();
