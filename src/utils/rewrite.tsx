export const localRewrite = async (text: string, style: string): Promise<string> => {
    let rewriter = null

    try {
        // @ts-ignore
        rewriter = await Rewriter.create()
    } catch {
        return "无法重写，客户端不支持端侧模型"
    }

    const result = await rewriter.rewrite(text, {
        context: style
    })

    return result
}

export const localSummarize = async (text: string): Promise<string> => {
    let summarizer = null

    try {
        // @ts-ignore
        summarizer = await Summarizer.create({ type: "tl;dr" })
    } catch {
        return "无法总结，客户端不支持端侧模型"
    }

    const result = await summarizer.summarize(text)
    return result
}