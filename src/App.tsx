import { useState } from "react"
import "./App.css"

import Translate from "./components/Translate"
import Rewrite from "./components/Rewrite"
import Chat from "./components/Chat"

type Tab = "translate" | "rewrite" | "chat"

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat")

  return (
    <div className="app-container">

      <div className="tab-nav">
        <button className={activeTab === "chat" ? "tab active" : "tab"} onClick={() => setActiveTab("chat")}>
          {chrome.i18n.getMessage("chat_element_tab_title")}
        </button>
        <button className={activeTab === "rewrite" ? "tab active" : "tab"} onClick={() => setActiveTab("rewrite")}>
          {chrome.i18n.getMessage("rewrite_element_tab_title")}
        </button>
        <button className={activeTab === "translate" ? "tab active" : "tab"} onClick={() => setActiveTab("translate")}>
          {chrome.i18n.getMessage("translate_element_tab_title")}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "translate" && <Translate />}
        {activeTab === "rewrite" && <Rewrite />}
        {activeTab === "chat" && <Chat />}
      </div>
    </div>
  )
}

export default App
