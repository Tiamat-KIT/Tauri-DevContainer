// import OpenAI from "openai";
import gpt from "./gpt/client";

export default async function PdfToResponseGenerate(file: File) {
    const Thread = await gpt.beta.threads.create()
    const PresenPdf = await gpt.files.create({
        file,
        purpose: "assistants"
    })

    const ThreadId = Thread.id
    const FileId = PresenPdf.id
    
    const response = await gpt.beta.threads.messages.create(
        ThreadId,
        {
            role: "user",
            content: [{
                type: "text",
                text: `あなたは研究発表を聞いている聴衆です。あなたには研究内容についていくつか質問をする権利があります。その際、あなたが質問する内容を述べてください。なお、研究内容としてスライドのデータを提供します`, 
            }],
            attachments: [
                {
                    file_id: FileId
                }
            ]
        },
    )

    return response.content
}