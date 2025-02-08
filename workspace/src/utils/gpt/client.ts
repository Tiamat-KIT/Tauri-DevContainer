import OpenAI from "openai";

/* declare global {
    var gpt_client: OpenAI | undefined
}
const gpt_client = global.gpt_client || new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true
})

if(import.meta.env.DEV) global.gpt_client = gpt_client
const gpt = gpt_client */
export default new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true
})