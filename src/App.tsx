import { useState } from "react"
import "App.css"

import Translate from "@/components/Translate"
import Rewrite from "@/components/Rewrite"
import Chat from "@/components/Chat"

type Tab = "translate" | "rewrite" | "chat"

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat")

  const views = chrome.extension.getViews({ type: "popup" })
  const isPopup = views.includes(window)

  const openFullPage = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      width: 380,
      height: 620,
    })
  }

  const getDesc = () => {
    switch (activeTab) {
      case "translate":
        return chrome.i18n.getMessage("translate_element_tab_desc")
      case "rewrite":
        return chrome.i18n.getMessage("rewrite_element_tab_desc")
      case "chat":
        return chrome.i18n.getMessage("chat_element_tab_desc")
    }
  }

  return (
    <div className="app-container">
      <header className="container app-header">
        <h5>{getDesc()}</h5>
        {isPopup && (
          <button type="button" className="outline secondary" onClick={openFullPage}>
            展开
          </button>
        )}
      </header>

      <nav className="tabs" role="group">
        <button
          type="button"
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          {chrome.i18n.getMessage("chat_element_tab_title")}
        </button>
        <button
          type="button"
          className={activeTab === "rewrite" ? "active" : ""}
          onClick={() => setActiveTab("rewrite")}
        >
          {chrome.i18n.getMessage("rewrite_element_tab_title")}
        </button>
        <button
          type="button"
          className={activeTab === "translate" ? "active" : ""}
          onClick={() => setActiveTab("translate")}
        >
          {chrome.i18n.getMessage("translate_element_tab_title")}
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "translate" && <Translate />}
        {activeTab === "rewrite" && <Rewrite />}
        {activeTab === "chat" && <Chat />}
      </main>
    </div>
  )
}
