const systemPrompt = "你是一个高效简洁的助手，只提供直接、明确、有用的回答，不啰嗦、不客套。"

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

export const localChatStream = async (text: string) => {
    let session = await createSession()
    if (!session) return "无法对话，客户端不支持端侧模型"

    const stream = session.promptStreaming(text)
    return stream
}

export const localChat = async (text: string): Promise<string> => {
    let session = await createSession()
    if (!session) return "无法对话，客户端不支持端侧模型"

    const result = await session.prompt(text)
    return result
}