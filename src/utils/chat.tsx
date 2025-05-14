export type Message = {
    role: "user" | "assistant"
    content: string
}

const systemPrompt = chrome.i18n.getMessage("chat_message_system_prompt")

const createSession = async () => {
    try {
        // @ts-ignore
        const session = await LanguageModel.create({
            initialPrompts: [{ role: "system", content: systemPrompt }]
        })
        return session
    } catch {
        return null
    }
}

export const localChatStream = async (text: Message[]) => {
    let session = await createSession()
    if (!session) return chrome.i18n.getMessage("chat_message_init_error")

    const stream = session.promptStreaming(text)
    return stream
}

export const localChat = async (text: Message[]): Promise<string> => {
    let session = await createSession()
    if (!session) return chrome.i18n.getMessage("chat_message_init_error")

    const result = await session.prompt(text)
    return result
}