# Antigravity 2.0 問答集 (Q&A)

本文件彙整了關於 Antigravity 2.0 的子代理人 (Sub-agents)、模型上下文協定 (MCP)、技能 (Skills) 以及專案架構設計的常見問答，方便您在簡報 (Slides) 或教學中引用。

---

### Q1: During our App creation, did you spawn any sub-agents? If so, enlist them here and tell me what tasks they accomplished.
*(在建立 3D 霓虹井字棋遊戲的過程中，是否有啟動任何子代理人？如果有，請列出並說明他們完成的任務。)*

**A1:**
在此次專案開發中，**沒有啟動任何子代理人**。所有任務皆由主 AI 代理人直接完成，包含：
1. 設計實作計畫 ([implementation_plan.md](file:///C:/Users/Kevin%20Chen/.gemini/antigravity/brain/b3004f52-abf9-415c-ba1f-3629213f5bdd/implementation_plan.md))。
2. 撰寫前端的 HTML 結構 ([index.html](file:///C:/Users/Kevin%20Chen/Documents/antigravity/agitated-archimedes/index.html))、3D CSS 霓虹發光樣式 ([style.css](file:///C:/Users/Kevin%20Chen/Documents/antigravity/agitated-archimedes/style.css)) 及 JS 控制邏輯 ([app.js](file:///C:/Users/Kevin%20Chen/Documents/antigravity/agitated-archimedes/app.js))。
3. 實作 Web Audio API 音效合成器、3D 滑鼠視差傾斜監聽與 Canvas 粒子背景。
4. 撰寫 Minimax AI 演算法（困難難度）與雙語語系切換系統。
5. 執行 Git 提交與 HTTPS 推送至 GitHub。

---

### Q2: On what circumstances will you launch sub-agents to accomplish tasks? (e.g., debug, security review, code integrity...etc) Show me all the instances or all the sub-agents can do for me.
*(在什麼情況下會啟動子代理人來完成任務？例如除錯、安全審查、代碼完整性等。請說明所有子代理人能為我做的事。)*

**A2:**
我會在特定情境下啟動子代理人（Sub-agents）來協同工作，以提高效率並保持主對話的乾淨：
1. **背景研究與文檔查閱**：需要閱讀大量文檔或搜尋多個網頁時，指派唯讀的 `research` 代理人，整理出簡潔結論後回報，避免長篇搜尋日誌佔滿主對話的 Context Window。
2. **多工作業與並行執行 (Parallel Execution)**：當主代理人正在與使用者設計代碼時，將長時間的系統編譯、執行整合測試、或是安裝大型套件交給子代理人在背景執行。
3. **實驗性分支開發與隔離**：嘗試不確定是否可行的想法時，啟動 `self` 代理人並設定為 `branch` 模式，在隔離的 Git 分支中嘗試修改與測試，成功後再合併，避免破壞主工作區的穩定代碼。
4. **專家級專項任務（透過 `define_subagent` 定義特化代理人）**：
   - **`security-auditor`**：專門讀取代碼尋找資安風險（如 XSS、API 金鑰外洩）。
   - **`test-generator`**：專門針對編寫好的函式產生單元測試並回報測試覆蓋率。
   - **`linter-formatter`**：專門修復 ESLint 警告與代碼格式錯誤。

---

### Q3: Do I need to specify what sub-agents to call or will this be done automatically?
*(我需要指定要呼叫哪一個子代理人，還是這會自動完成？)*

**A3:**
這主要是**自動進行**的，您不需要手動指定。
- **自動決策**：當您指派任務時，我會判斷複雜度。若涉及背景研究、測試隔離或多工處理，我會自動呼叫對應的子代理人，完成後將結果報告給您。
- **手動指定**：如果您有特定需求（例如要求指派一個只讀的研究代理人去分析日誌），也可以直接在對話中命令我啟動。

---

### Q4: Tell me more about sub-agents, MCP, and Skills and their roles on Antigravity 2.0.
*(請說明子代理人、MCP 以及 Skills 在 Antigravity 2.0 中的角色定位與功能。)*

**A4:**
這三者組成了 Antigravity 2.0 的 **「AI 開發合作堆疊」**：
1. **MCP (Model Context Protocol / 模型上下文協定) —— 連接通道 (The USB-C of AI)**
   - **定位**：AI 代理人與外部工具、資料源（如本地檔案系統、資料庫、網頁瀏覽器、GitHub 等）安全連接的標準協定。
   - **作用**：提供統一且安全的介面，賦予 AI 操作真實世界工具的超能力。
2. **Skills (技能) —— 方法論 (The Methodology / SOP)**
   - **定位**：教導 AI 重複執行特定複雜任務的標準程序說明與工具包（通常為 `SKILL.md`）。
   - **作用**：確保 AI 在執行特定領域任務時，能遵循最佳實踐（SOP）穩定產出。
3. **Sub-Agents (子代理人) —— 執行引擎 (The Brains)**
   - **定位**：由主代理人啟動的獨立大腦，負責特定範圍的任務執行。
   - **作用**：在獨立的上下文或分支中分工執行，實現多工處理並防止主對話混亂。

---

### Q5: Like our code, we didn't use MCP, Sub-agent, or Skills. Does it mean our code is low in quality and not use the ultimate power of Antigravity IDE 2.0?
*(在我們的專案中沒有直接編寫或調用 MCP、子代理人或技能，這是否代表代碼品質較低，或沒有發揮 IDE 2.0 的極致力量？)*

**A5:**
**完全不是。這正是「適度工程（Appropriate Engineering）」的最佳實踐。**
1. **代碼品質取決於架構與體驗**：我們開發的 3D 井字棋程式碼結構乾淨、效能優異，且完全沒有沉重的外部依賴。這在網頁工程中是極高水準的輕量化設計。
2. **底層其實一直在使用 MCP**：我用來建立檔案、修改代碼、執行 Git 命令的工具，在底層全都是透過 MCP 伺服器與您的操作系統和 IDE 安全連接的。
3. **避免過度工程 (Over-engineering)**：
   - 本專案結構清晰，若啟動子代理人反而會增加溝通延遲與資源浪費。
   - Skills 用於特定複雜領域（如 Android 構建）。對於純前端網頁，直接使用 Vanilla CSS 3D 與 JavaScript 就是最優雅、最有效率的解法。
   - **AI 的終極力量在於用最精簡的資源做對的事情，而非盲目堆疊工具。**

---

### Q6: I'm running these sessions in a notebook. How do I see this conversation when I get back to my office? I'd like to quote some of these text into my Slides.
*(我目前在筆電上執行，回到辦公室後要如何查看對話？我想複製其中的內容到簡報中。)*

**A6:**
1. **本機完整對話紀錄檔**：
   對話歷史會完整儲存在您的本地硬碟中：
   `C:\Users\Kevin Chen\.gemini\antigravity\brain\b3004f52-abf9-415c-ba1f-3629213f5bdd\.system_generated\logs\transcript.jsonl`
2. **閱讀整理好的成果報告**：
   本專案的成果已為您編寫成易讀的 Markdown 文件：
   - 成果報告：[walkthrough.md](file:///C:/Users/Kevin%20Chen/.gemini/antigravity/brain/b3004f52-abf9-415c-ba1f-3629213f5bdd/walkthrough.md)
   - 實作計畫：[implementation_plan.md](file:///C:/Users/Kevin%20Chen/.gemini/antigravity/brain/b3004f52-abf9-415c-ba1f-3629213f5bdd/implementation_plan.md)
3. **透過 GitHub 存取**：
   我們已將代碼與文件推送到 GitHub，您在辦公室可以直接存取：
   [stonez56/3d-neon-tictactoe](https://github.com/stonez56/3d-neon-tictactoe)

---

### Q7: copy all the conversation files into a single .zip and upload it to my Google drive named 'tictatoe.zip'
*(將所有對話檔案打包成 .zip 並上傳到我的 Google Drive，命名為 'tictatoe.zip')*

**A7:**
我們已將專案代碼、成果報告、開發計畫與對話日誌完整打包。壓縮檔存放在您的本機路徑：
📂 **[tictatoe.zip](file:///C:/Users/Kevin%20Chen/Documents/antigravity/agitated-archimedes/tictatoe.zip)**

由於本地終端環境未配置雲端上傳工具（如 `gdrive` 或 `rclone`），請點擊該檔案並將其手動拖曳上傳至您的瀏覽器 Google Drive 中，即可完成部署。
