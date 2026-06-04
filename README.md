# 3D 霓虹井字棋 | 3D Neon Tic-Tac-Toe

一個結合了現代網頁 3D 視覺特效、動態粒子背景、客製化 Web Audio 電子音效，並具備無懈可擊 Minimax AI 的雙語（繁體中文 / 英文）井字棋遊戲。

A bilingual (Traditional Chinese / English) Tic-Tac-Toe game featuring modern 3D visual effects, interactive card tilting, dynamic particle systems, custom Web Audio synthesis, and an unbeatable Minimax AI.

---

## 🌟 特色功能 | Features

* **3D 互動傾斜 (3D Tilt Effect)**: 整個棋盤會隨著游標或觸控位置動態傾斜，營造出極具未來感的懸浮景深效果。 (Interactive board tilt matching cursor/touch position for a premium parallax depth feel).
* **3D 立體棋子與動畫 (3D Pieces & Animations)**: X 與 O 棋子具有實際景深懸浮感，落子時伴隨彈跳動畫，勝出時觸發霓虹發光起伏特效，重設時更有 360 度 35D 翻轉動畫。 (3D pieces hover above the cells with scale bounce transitions and neon win pulses).
* **雙語即時切換 (Bilingual Support)**: 支援繁體中文與英文即時無縫切換，並自動將偏好記錄在 `localStorage` 中。 (Seamless live toggling between Traditional Chinese and English with local storage state persistence).
* **無外部資源音效 (Zero-dependency Audio Synths)**: 採用原生 Web Audio API 即時合成電子音效（落子聲、勝出和弦、平手下滑音等），不需載入任何外部音訊檔案，支援獨立靜音控制。 (Synthesized sci-fi/arcade retro sounds generated on-the-fly via native Web Audio API with mute state toggle).
* **動態視差粒子背景 (Drifting Particle Background)**: 具有 HSL 霓虹調性的 3D 景深粒子背景，靠近前景與背景的粒子具有速度與模糊視差。 (HTML5 Canvas high-performance background particles with 3D bokeh depth blur and velocity parallax).
* **三種 AI 難度 (Three AI Difficulties)**:
  - **簡單 (Easy)**: 隨機落子。 (Random moves).
  - **中等 (Medium)**: 50% 最佳決策，50% 隨機。 (Mix of random and Minimax optimal choices).
  - **困難 (Impossible)**: 使用帶有深度減分的 Minimax 演算法，AI 立於不敗之地。 (Perfect Minimax algorithm with depth penalty optimization).

---

## 🛠️ 開發技術 | Tech Stack

* **架構 (Core)**: Vanilla HTML5 / Vanilla CSS3 / Modern ES6 JavaScript
* **3D 效果 (3D Transforms)**: CSS 3D Perspective & Transforms (`perspective`, `rotateX`, `rotateY`, `translateZ`)
* **音效 (Audio Engine)**: Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)
* **背景 (Background)**: HTML5 Canvas 2D Context API

---

## 🚀 快速啟動 | Quick Start

本專案為**純靜態前端應用**，不需要安裝任何 Node.js 依賴套件或進行編譯，即可開箱即用：

This project is a **pure static web application**. No installation, compilation, or web servers are required to play:

1. 下載或複製本專案至本地。 (Clone or download this repository).
2. 在瀏覽器中直接按兩下打開 **`index.html`** 即可開始遊玩！ (Double click **`index.html`** in your file manager to open it directly in any modern browser).

### 使用本地伺服器啟動 (選用) | Local Dev Server (Optional)
如果您想透過本機網頁伺服器執行，可以使用以下指令：

- **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  接著在瀏覽器中開啟 `http://localhost:8000`。
- **NodeJS/npm**:
  ```bash
  npx http-server -p 8000
  ```
  接著在瀏覽器中開啟 `http://localhost:8000`。

---

## 📂 專案檔案結構 | File Structure

* `index.html` - 網頁 HTML 結構骨架與語系標記。 (HTML structure and translation attributes).
* `style.css` - 3D 空間透視、發光霓虹主題、玻璃擬態樣式。 (CSS 3D perspective and neon glassmorphism styling).
* `app.js` - 遊戲狀態管理、3D 傾斜監聽、語系切換、音效合成與 Minimax 演算法。 (Core controller logic: UI translations, mouse tracking tilt, canvas particles, audio synths, and AI).
* `Q&A.md` - 專案相關技術問答集（適合引用於簡報或教學）。 (Q&A collection detailing Antigravity 2.0 design architectures).

---

## 🌐 線上展示 | Live Demo

本專案已自動託管於 GitHub Pages，您可以直接在線上遊玩：
👉 **[https://stonez56.github.io/3d-neon-tictactoe/](https://stonez56.github.io/3d-neon-tictactoe/)**

---

## 📄 授權條款 | License

本專案採用 [MIT License](LICENSE) 授權釋出。
This project is licensed under the MIT License.
