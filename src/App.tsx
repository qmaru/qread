import { useState } from "react"
import "./App.css"

import Translate from "./components/Translate"
import Rewrite from "./components/Rewrite"
import Prompt from "./components/Prompt"

type Tab = "translate" | "rewrite" | "prompt"


function App() {
  const [activeTab, setActiveTab] = useState<Tab>("translate")

  return (
    <div className="app-container">

      <div className="tab-nav">
        <button
          className={activeTab === 'translate' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('translate')}
        >
          翻译
        </button>
        <button
          className={activeTab === 'rewrite' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('rewrite')}
        >
          重写
        </button>
        <button
          className={activeTab === 'prompt' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('prompt')}
        >
          生成
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "translate" && <Translate />}
        {activeTab === "rewrite" && <Rewrite />}
        {activeTab === "prompt" && <Prompt />}
      </div>
    </div>
  )
}

export default App
