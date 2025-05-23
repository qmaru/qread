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

    try {
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
    } catch (e) {
      console.log(e)
    }
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
      <main className="chat-wrapper" ref={containerRef}>
        {outputMessages.map((msg: Message, index: number) => (
          <div key={"msg" + index} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
      </main>

      <footer className="chat-footer">
        <div className="chat-textarea">
          <textarea placeholder={chrome.i18n.getMessage("chat_element_text_greeting")} rows={1} value={inputMessage} onChange={inputOnChange}>
          </textarea></div>
        <button onClick={CallCaht} disabled={!inputMessage.trim() || isChating}>
          {isChating ? <span className="common-btn-loading" /> : chrome.i18n.getMessage("chat_element_button_title_send")}
        </button>
      </footer>
    </div>
  )
}

export default Chat
