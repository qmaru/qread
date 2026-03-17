import { useState, useTransition } from "react"

import {
  abortLocalRewrite,
  abortLocalSummarize,
  localRewriteStream,
  localSummarizeStream,
} from "@/utils/rewrite"

import { useModelMonitor } from "@/utils/common"

import "@/styles/rewrite.css"
import "@/styles/common.css"

interface styleData {
  label: string
  value: string
}

const styles: styleData[] = [
  {
    label: chrome.i18n.getMessage("rewrite_element_select_label_concise"),
    value: "Make the text more concise and to the point.",
  },
  {
    label: chrome.i18n.getMessage("rewrite_element_select_label_formal"),
    value: "Rewrite in a more formal and professional tone.",
  },
  {
    label: chrome.i18n.getMessage("rewrite_element_select_label_friendly"),
    value: "Make the tone more friendly and approachable.",
  },
  {
    label: chrome.i18n.getMessage("rewrite_element_select_label_persuasive"),
    value: "Rewrite to be more persuasive and convincing.",
  },
  {
    label: chrome.i18n.getMessage("rewrite_element_select_label_summary"),
    value: "Summarize the key points clearly and briefly.",
  },
]

export default function Rewrite() {
  const [inputText, setInputText] = useState<string>("")
  const [outputStyle, setOutputStyle] = useState<string>(styles[0].value)
  const [outputText, setOutputText] = useState<string>("")
  const [isRewriting, startRewriting] = useTransition()
  const { isLoading, progress, handleMonitor } = useModelMonitor()

  const inputOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
    setOutputText("")
  }

  const outputStyleOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setOutputStyle(e.target.value)
  }

  const stopRewrite = () => {
    if (outputStyle.includes("Summarize")) {
      abortLocalSummarize()
    } else {
      abortLocalRewrite()
    }
  }

  const sendRewrite = async () => {
    if (!inputText.trim()) return

    if (isRewriting) stopRewrite()

    setOutputText("")

    startRewriting(async () => {
      let chunks = ""

      try {
        if (outputStyle.includes("Summarize")) {
          chunks = await localSummarizeStream(inputText, handleMonitor)
        } else {
          chunks = await localRewriteStream(inputText, outputStyle, handleMonitor)
        }

        for await (const chunk of chunks) {
          setOutputText((prev) => prev + chunk)
        }
      } catch {}
    })
  }

  return (
    <div className="rewrite-wrapper">
      <header>
        <h6>{chrome.i18n.getMessage("rewrite_element_select_label_style")}</h6>
        <div>
          <select id="language" value={outputStyle} onChange={outputStyleOnChange}>
            {styles.map((style: styleData, index: number) => (
              <option key={"style" + index} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="rewrite-main">
        <div>
          <textarea
            placeholder={chrome.i18n.getMessage("rewrite_element_textarea_placeholder_title_input")}
            onChange={inputOnChange}
            value={inputText}
            rows={5}
            cols={30}
          />
        </div>

        <div role="group">
          {isRewriting ? (
            <button onClick={stopRewrite} disabled={!outputText.trim()}>
              {chrome.i18n.getMessage("rewrite_element_button_stop")}
            </button>
          ) : isLoading ? (
            <button onClick={sendRewrite} aria-busy={isLoading}>
              {chrome.i18n.getMessage("rewrite_element_button_load") + ` (${progress}%)`}
            </button>
          ) : (
            <button onClick={sendRewrite} disabled={!inputText.trim()}>
              {chrome.i18n.getMessage("rewrite_element_button_start")}
            </button>
          )}
        </div>

        <textarea
          placeholder={
            isRewriting
              ? chrome.i18n.getMessage("rewrite_element_textarea_placeholder_title_waiting")
              : chrome.i18n.getMessage("rewrite_element_textarea_placeholder_title_output")
          }
          readOnly
          value={outputText}
          rows={5}
          cols={30}
        />
      </main>
    </div>
  )
}
