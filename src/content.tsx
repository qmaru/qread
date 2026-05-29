import { localTranslate } from "@/utils/translate"
import "content.css"

let translateButton: HTMLDivElement | null = null

const removeTranslateButton = () => {
  translateButton?.remove()
  translateButton = null
}

const showTranslationPopup = (translatedText: string) => {
  const selection = window.getSelection()

  if (!selection || !selection.rangeCount) {
    return
  }

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

  div.addEventListener("mouseenter", () => {
    clearTimeout(autoRemoveTimer)
  })

  div.addEventListener("mouseleave", () => {
    autoRemoveTimer = setTimeout(() => {
      div.remove()
    }, 3000)
  })
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
      console.error(errmsg + ": ", e)
    }
  }
})

document.addEventListener("mouseup", (e) => {
  const target = e.target as HTMLElement | null

  if (target?.closest(".translator-trigger")) {
    return
  }

  setTimeout(() => {
    const selection = window.getSelection()

    if (!selection || !selection.rangeCount) {
      removeTranslateButton()
      return
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect()

    if (!selection || !selection.rangeCount) {
      removeTranslateButton()
      return
    }

    const text = selection.toString().trim()

    if (!text) {
      removeTranslateButton()
      return
    }

    removeTranslateButton()

    const wrapper = document.createElement("div")
    wrapper.className = "translator-trigger"

    wrapper.style.position = "absolute"
    wrapper.style.left = `${rect.right + window.scrollX + 6}px`
    wrapper.style.top = `${rect.top + window.scrollY - 4}px`
    wrapper.style.zIndex = "2147483647"
    wrapper.style.cursor = "pointer"
    wrapper.style.lineHeight = "0"

    const button = document.createElement("img")

    button.src = chrome.runtime.getURL("icon_32.png")
    button.style.width = "24px"
    button.style.height = "24px"
    button.style.border = "none"
    button.style.borderRadius = "0"
    button.style.boxShadow = "none"
    button.style.background = "transparent"
    button.draggable = false
    wrapper.appendChild(button)

    wrapper.addEventListener("mousedown", (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
    })

    wrapper.addEventListener("click", async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()

      try {
        const result = await chrome.storage.sync.get(["targetLang"])

        const translated = await localTranslate(text, String(result.targetLang ?? "zh"))

        showTranslationPopup(translated)
      } catch (err) {
        const errmsg = chrome.i18n.getMessage("translate_message_get_error")
        console.error(errmsg + ": ", err)
      }

      removeTranslateButton()
    })

    document.body.appendChild(wrapper)

    translateButton = wrapper
  }, 0)
})

document.addEventListener("mousedown", (event) => {
  const target = event.target as HTMLElement | null

  if (!target || !target.closest(".translator-popup")) {
    document.querySelectorAll(".translator-popup").forEach((el) => el.remove())
  }

  if (!target || !target.closest(".translator-trigger")) {
    removeTranslateButton()
  }
})
