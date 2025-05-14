import { useState, useTransition } from "react"

import { localRewrite, localSummarize } from "../utils/rewrite"

interface styleData {
  label: string
  value: string
}

const styles: styleData[] = [
  { label: chrome.i18n.getMessage("rewrite_element_select_label_concise"), value: "Make the text more concise and to the point." },
  { label: chrome.i18n.getMessage("rewrite_element_select_label_formal"), value: "Rewrite in a more formal and professional tone." },
  { label: chrome.i18n.getMessage("rewrite_element_select_label_friendly"), value: "Make the tone more friendly and approachable." },
  { label: chrome.i18n.getMessage("rewrite_element_select_label_persuasive"), value: "Rewrite to be more persuasive and convincing." },
  { label: chrome.i18n.getMessage("rewrite_element_select_label_summary"), value: "Summarize the key points clearly and briefly." },
]

const Rewrite = () => {
  const [inputText, setInputText] = useState<string>("")
  const [outputStyle, setOutputStyle] = useState<string>(chrome.i18n.getMessage("rewrite_element_select_label_concise"))
  const [outputText, setOutputText] = useState<string>("")
  const [isRewriting, startRewriting] = useTransition()

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
    setOutputText("")
  }

  const outputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputText(event.target.value)
  }

  const outputStyleOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setOutputStyle(e.target.value)
  }

  const CallRewrite = async () => {
    if (!inputText.trim()) return

    let result = ""

    startRewriting(async () => {
      if (outputStyle.includes("Summarize")) {
        result = await localSummarize(inputText)
      } else {
        result = await localRewrite(inputText, outputStyle)
      }
      setOutputText(result)
    })
  }

  return (
    <div className="card">
      <header>
        <h3>{chrome.i18n.getMessage("rewrite_element_select_label_style")}</h3>
        <select
          id="language"
          value={outputStyle}
          onChange={outputStyleOnChange}
        >
          {styles.map((style: styleData, index: number) => {
            return (
              <option key={"style" + index} value={style.value}>{style.label}</option>
            )
          })}
        </select>
      </header>

      <main className="rewrite-main">
        <textarea placeholder={chrome.i18n.getMessage("rewrite_element_textarea_placeholder_title_input")} onChange={inputOnChange} value={inputText} />

        <div className="rewrite-btn">
          <button onClick={CallRewrite} disabled={!inputText.trim() || isRewriting}>
            {isRewriting ? (
              <>
                <span className="common-btn-loading" /> {chrome.i18n.getMessage("rewrite_element_button_title_loading")}
              </>
            ) : (
              chrome.i18n.getMessage("rewrite_element_button_title_title")
            )}
          </button>
        </div>

        <textarea placeholder={chrome.i18n.getMessage("rewrite_element_textarea_placeholder_title_output")} readOnly onChange={outputOnChange} value={outputText} />
      </main>
    </div>
  )
}

export default Rewrite
