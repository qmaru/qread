import { useState } from "react"

import { localChatStream } from "../utils/chat"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>("")
  const [outputMessages, setOutputMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value)
  }

  const CallCaht = async () => {
    setLoading(true)

    const userMessage: Message = {
      id: Date.now() + "-user",
      role: "user",
      content: inputMessage,
    }
    setOutputMessages(prev => [...prev, userMessage])
    setInputMessage("")

    const chunks = await localChatStream(inputMessage)
    for await (const chunk of chunks) {
      setOutputMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        } else {
          return [...prev, { id: Date.now() + "-assistant", role: "assistant", content: chunk }]
        }
      })
    }

    setLoading(false)
  }

  return (
    <div className="card">
      <header>
        <h3>AI 聊天</h3>
      </header>

      <main className="chat-wrapper">
        {outputMessages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
      </main>

      <footer className="chat-footer">
        <div className="chat-textarea">
          <textarea placeholder="开始聊天" rows={1} value={inputMessage} onChange={inputOnChange}>
          </textarea></div>
        <button onClick={CallCaht} disabled={!inputMessage.trim() || loading}>
          {loading ? <span className="common-btn-loading" /> : "发送"}
        </button>
      </footer>
    </div>
  )
}

export default Chat
