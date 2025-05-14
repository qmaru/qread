import { useRef, useState, useTransition, useEffect } from "react"

import { localChatStream, type Message } from "../utils/chat"

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>("")
  const [outputMessages, setOutputMessages] = useState<Message[]>([])
  const [isChating, startChating] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value)
  }

  const CallCaht = async () => {
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
    }
    setOutputMessages(prev => [...prev, userMessage])
    setInputMessage("")

    // history
    const history = [...outputMessages, userMessage].slice(-6)

    startChating(async () => {
      const chunks = await localChatStream(history)
      for await (const chunk of chunks) {
        setOutputMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === "assistant") {
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
          } else {
            return [...prev, { role: "assistant", content: chunk }]
          }
        })
      }
    })
  }

  useEffect(() => {
    const c = containerRef.current
    if (c) {
      c.scrollTo({
        top: c.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [outputMessages])

  return (
    <div className="card">
      <header>
        <h3>AI 聊天</h3>
      </header>

      <main className="chat-wrapper" ref={containerRef}>
        {outputMessages.map((msg: Message, index: number) => (
          <div key={"msg" + index} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
      </main>

      <footer className="chat-footer">
        <div className="chat-textarea">
          <textarea placeholder="开始聊天" rows={1} value={inputMessage} onChange={inputOnChange}>
          </textarea></div>
        <button onClick={CallCaht} disabled={!inputMessage.trim() || isChating}>
          {isChating ? <span className="common-btn-loading" /> : "发送"}
        </button>
      </footer>
    </div>
  )
}

export default Chat
