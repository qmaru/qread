# qread

client-side ai of gemini-nano.

+ translate api
+ rewrite api
+ prompt api

## More

[AI on Chrome](https://developer.chrome.com/docs/ai/get-started)

## Setting

Tested and passed in Chrome 136.

```shell
# Enabled BypassPerfRequirement
chrome://flags/#optimization-guide-on-device-model

# Enabled
chrome://flags/#prompt-api-for-gemini-nano
chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
chrome://flags/#summarization-api-for-gemini-nano
chrome://flags/#writer-api-for-gemini-nano
chrome://flags/#rewriter-api-for-gemini-nano
chrome://flags/#language-detection-api
chrome://flags/#translation-api

# F12 console

# If it is "available", skip it.
await LanguageModel.availability();

# If it is "downloadable", it needs to be executed.
await LanguageModel.create();

# Check [Optimization Guide On Device Model]
# ~ 3GB
chrome://components/

# 1.Prompt API
const session = await LanguageModel.create();
const result = await session.prompt("Hello");
console.log(result);

# 2.Translate API
const translator = await Translator.create({
  sourceLanguage: "en",
  targetLanguage: "ja"
});

const text = await translator.translate("Hello, world!");
console.log(text);
```
