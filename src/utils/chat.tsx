export type Message = {
  role: "user" | "assistant"
  content: string
}

const systemPrompt = chrome.i18n.getMessage("chat_message_system_prompt")

let currentSession: any = null
let currentAbortController: AbortController | null = null

const createSession = async () => {
  try {
    // @ts-ignore
    const session = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: systemPrompt }],
    })
    return session
  } catch {
    return null
  }
}

export const abortLocalChat = () => {
  if (currentAbortController) {
    currentAbortController.abort()
    currentAbortController = null
  }

  if (currentSession) {
    try {
      currentSession.destroy?.()
    } catch {}
    currentSession = null
  }
}

export const localChatStream = async (text: Message[]) => {
  currentSession = await createSession()
  if (!currentSession) return chrome.i18n.getMessage("chat_message_init_error")

  currentAbortController = new AbortController()

  const stream = currentSession.promptStreaming(text, {
    signal: currentAbortController.signal,
  })

  return stream
}

export const localChat = async (text: Message[]): Promise<string> => {
  currentSession = await createSession()
  if (!currentSession) return chrome.i18n.getMessage("chat_message_init_error")

  currentAbortController = new AbortController()

  try {
    const result = await currentSession.prompt(text, {
      signal: currentAbortController.signal,
    })
    return result
  } catch (e) {
    if (currentAbortController.signal.aborted) {
      return "aborted"
    }
    throw e
  }
}
