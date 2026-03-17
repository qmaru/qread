import { useState, useTransition } from "react"
import { localTranslate } from "@/utils/translate"

import "@/styles/translate.css"
import "@/styles/common.css"

interface languageData {
  label: string
  value: string
}

const languages: languageData[] = [
  { label: chrome.i18n.getMessage("translate_element_select_label_Chinese"), value: "zh" },
  { label: chrome.i18n.getMessage("translate_element_select_label_English"), value: "en" },
  { label: chrome.i18n.getMessage("translate_element_select_label_Japanese"), value: "ja" },
  { label: chrome.i18n.getMessage("translate_element_select_label_France"), value: "fr" },
]

export default function Translate() {
  const [inputText, setInputText] = useState<string>("")
  const [inputLanguage, setInputLanguage] = useState<string>("zh")
  const [translated, setTranslated] = useState<string>("")
  const [isTranslating, startTranslating] = useTransition()

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
    setTranslated("")
  }

  const inputLanguageOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setInputLanguage(e.target.value)
  }

  const CallTranslate = async () => {
    if (!inputText.trim()) return

    startTranslating(async () => {
      const result = await localTranslate(inputText, inputLanguage)
      setTranslated(result)
    })
  }

  return (
    <div>
      <header>
        <h6>{chrome.i18n.getMessage("translate_element_select_label_style")}</h6>
        <select id="language" value={inputLanguage} onChange={inputLanguageOnChange}>
          {languages.map((lan: languageData, index: number) => {
            return (
              <option key={"lan" + index} value={lan.value}>
                {lan.label}
              </option>
            )
          })}
        </select>
      </header>

      <main className="translate-main">
        <h6>{chrome.i18n.getMessage("translate_element_h3_text")}</h6>
        <p>{chrome.i18n.getMessage("translate_element_p_text")}</p>

        <div>
          <textarea
            placeholder="Hello"
            onChange={inputOnChange}
            value={inputText}
            rows={4}
            cols={30}
          />
        </div>

        <div role="group" className="translate-btn-group">
          <button
            disabled={!inputText.trim() || isTranslating}
            onClick={CallTranslate}
            aria-busy={isTranslating}
          >
            {chrome.i18n.getMessage("translate_element_button_start")}
          </button>
        </div>

        <div>
          <textarea
            placeholder={chrome.i18n.getMessage("translate_element_input_placeholder_title_result")}
            onChange={inputOnChange}
            value={translated}
            readOnly
            rows={4}
            cols={30}
          />
        </div>
      </main>
    </div>
  )
}
