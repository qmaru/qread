import { localTranslate } from "./utils/translate"
import "./content.css"

const showTranslationPopup = (translatedText: string) => {
  const selection = window.getSelection()
  if (selection) {
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const div = document.createElement("div")
    div.style.top = `${rect.top + window.scrollY - 40}px`
    div.style.left = `${rect.left + window.scrollX}px`
    div.innerText = translatedText
    div.className = "translator-popup"
    div.addEventListener("mousedown", (e) => {
      e.stopPropagation()
    })
    div.addEventListener("click", (e) => {
      e.stopPropagation()
    })
    document.body.appendChild(div)

    let autoRemoveTimer = setTimeout(() => {
      div.remove()
    }, 5000)

    div.addEventListener("mouseenter", () => clearTimeout(autoRemoveTimer))
    div.addEventListener("mouseleave", () => {
      autoRemoveTimer = setTimeout(() => {
        div.remove()
      }, 3000)
    })
  }
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "TRANSLATE") {
    const text = message.text
    const lang = message.lang
    try {
      const translated = await localTranslate(text, lang)
      showTranslationPopup(translated)
    } catch (e) {
      const errmsg = chrome.i18n.getMessage("translate_message_get_error")
      console.error(errmsg + ":  ", e)
    }
  }
})

// 点击空白移除旧的翻译框
document.addEventListener("mousedown", (event) => {
  const target = event.target as HTMLElement | null
  if (!target || !target.closest(".translator-popup")) {
    document.querySelectorAll(".translator-popup").forEach(el => el.remove())
  }
})