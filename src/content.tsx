import { localTranslate } from "./utils/translate"
import "./content.css"

const showTranslationPopup = (translatedText: string) => {
  const selection = window.getSelection()
  if (selection) {
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    const div = document.createElement("div")
    div.innerText = translatedText
    div.className = "translator-popup"
    div.style.top = `${rect.top + window.scrollY - 40}px`
    div.style.left = `${rect.left + window.scrollX}px`

    document.body.appendChild(div)

    setTimeout(() => {
      div.remove()
    }, 5000)
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
      console.error("翻译失败：", e)
    }
  } else if (message.type === "REWRITE") {
    console.log(message)
  } else if (message.type === "SUMMARY") {
    console.log(message)
  }
})

// 点击空白移除旧的翻译框
document.addEventListener("click", () => {
  document.querySelectorAll(".translator-popup").forEach(el => el.remove())
})