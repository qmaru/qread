import { useState } from "react"

import { localRewrite, localSummarize } from "../utils/rewrite"

interface styleData {
  label: string
  value: string
}

const styles: styleData[] = [
  { label: "更简洁", value: "Make the text more concise and to the point." },
  { label: "更正式", value: "Rewrite in a more formal and professional tone." },
  { label: "更亲切", value: "Make the tone more friendly and approachable." },
  { label: "更具说服力", value: "Rewrite to be more persuasive and convincing." },
  { label: "总结", value: "Summarize the key points clearly and briefly." },
]

const Rewrite = () => {
  const [inputText, setInputText] = useState<string>("")
  const [outputStyle, setOutputStyle] = useState<string>("更简洁")
  const [outputText, setOutputText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

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

    setLoading(true)

    let result = ""
    if (outputStyle.includes("Summarize")) {
      result = await localSummarize(inputText)
    } else {
      result = await localRewrite(inputText, outputStyle)
    }
    setOutputText(result)
    setLoading(false)
  }

  return (
    <div className="card">
      <header>
        <h3>选择重写风格</h3>
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
        <textarea placeholder="原文" onChange={inputOnChange} value={inputText} />

        <div className="rewrite-btn">
          <button onClick={CallRewrite} disabled={!inputText.trim() || loading}>
            {loading ? (
              <>
                <span className="common-btn-loading" /> 重写中...
              </>
            ) : (
              "执行重写"
            )}
          </button>
        </div>

        <textarea placeholder="重写" readOnly onChange={outputOnChange} value={outputText} />
      </main>
    </div>
  )
}

export default Rewrite
