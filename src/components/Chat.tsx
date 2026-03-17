import { useRef, useState, useTransition, useEffect } from "react"

import { abortLocalChat, localChatStream, type Message } from "@/utils/chat"
import Markdown from "react-markdown"

import { useModelMonitor } from "@/utils/common"

import "@/styles/chat.css"
import "@/styles/common.css"

export default function Chat() {
  const [inputMessage, setInputMessage] = useState("")
  const [outputMessages, setOutputMessages] = useState<Message[]>([])
  const [isChating, startChating] = useTransition()
  const [isTyping, setIsTyping] = useState(false)
  const { isLoading, progress, handleMonitor } = useModelMonitor()

  const containerRef = useRef<HTMLDivElement>(null)

  const inputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
  }

  const stopChat = () => {
    setIsTyping(false)
    abortLocalChat()
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    if (isChating) stopChat()

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
    }

    setOutputMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    const history = [...outputMessages, userMessage].slice(-6)

    let chunks = null
    try {
      chunks = await localChatStream(history, handleMonitor)
    } catch {
      setIsTyping(false)
      setOutputMessages((prev) => [
        ...prev,
        { role: "assistant", content: chrome.i18n.getMessage("chat_message_response_error") },
      ])
      return
    }

    if (typeof chunks === "string") {
      setIsTyping(false)
      setOutputMessages((prev) => [...prev, { role: "assistant", content: chunks }])
      return
    }

    startChating(async () => {
      try {
        let firstChunk = true
        for await (const chunk of chunks) {
          if (firstChunk) {
            setIsTyping(false)
            firstChunk = false
          }

          setOutputMessages((prev) => {
            const last = prev[prev.length - 1]

            if (last?.role === "assistant") {
              return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
            }

            return [...prev, { role: "assistant", content: chunk }]
          })
        }
      } catch {
      } finally {
        setIsTyping(false)
      }
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    const c = containerRef.current
    if (!c) return

    c.scrollTop = c.scrollHeight
  }, [outputMessages])

  return (
    <div className="chat-root">
      <main className="chat-wrapper" ref={containerRef}>
        {outputMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div className="chat-bubble">
              <Markdown>{msg.content}</Markdown>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message assistant typing">
            <div className="chat-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </main>

      <footer className="chat-footer">
        <textarea
          className="chat-textarea"
          placeholder={chrome.i18n.getMessage("chat_element_text_greeting")}
          rows={1}
          value={inputMessage}
          onChange={inputOnChange}
          onKeyDown={onKeyDown}
        />

        {isChating ? (
          <button className="chat-button stop" onClick={stopChat}>
            {chrome.i18n.getMessage("chat_element_button_title_stop")}
          </button>
        ) : isLoading ? (
          <button className="chat-button" onClick={sendMessage} aria-busy={isLoading}>
            {`${progress}%`}
          </button>
        ) : (
          <button className="chat-button" onClick={sendMessage} disabled={!inputMessage.trim()}>
            {chrome.i18n.getMessage("chat_element_button_title_send")}
          </button>
        )}
      </footer>
    </div>
  )
}
