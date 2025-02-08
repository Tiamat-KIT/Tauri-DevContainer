import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import QuestionGenerator from "../utils/gpt-client";
import markdownit from 'markdown-it'
import Modal from "./Modal";


export default function DragDrop(
    {inputRef,iframeRef}:{inputRef: React.RefObject<HTMLInputElement>,iframeRef: React.RefObject<HTMLIFrameElement>}
) {    
    const dropRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const [_isLoading,setLoading] = useState<boolean>(false)

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

    // PDFのテキストを抽出する関数
    const extractTextFromPDF = async (file: File) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        return new Promise<string>((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const pdfData = new Uint8Array(reader.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item: any) => item.str).join(" ");
                        fullText += pageText + "\n";
                    }
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error("PDFの読み込みに失敗しました"));
            };
        });
    };

    // PDFファイルを処理する関数
    const handleFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            alert("PDFファイルを選択してください");
            return;
        }

        // PDFのURLを作成（`iframe` で表示）
        const fileURL = URL.createObjectURL(file);
        const iframeEl = iframeRef.current
        if(iframeEl !== null) {
            iframeEl.hidden = false
            iframeEl.src = fileURL
        }

        const resultViewEl = document.getElementById("result")
        
        // モーダルを閉じる
        setIsModalOpen(false);
        setLoading(true)

        if(resultViewEl instanceof HTMLDivElement){
            ["loading","loading-spinner","loading-xl"].forEach((str) => {
                resultViewEl.classList.add(str)
            })
        }

        // 裏でテキストを抽出 & API送信
        try {
            // const extractedText = await extractTextFromPDF(file);
            const result = await QuestionGenerator(file);
            setLoading(false)
            
            if(resultViewEl instanceof HTMLDivElement){
                /* const parseMarkdown = new markdownit();
                ["loading","loading-spinner","loading-xl"].forEach((str) => {
                    resultViewEl.classList.remove(str)
                }) */
                resultViewEl.innerHTML = JSON.stringify(result,null,2)// parseMarkdown.render(result)
            }
        } catch (error) {
            console.error("テキストの抽出に失敗しました:", error);
        }
    };

    // ファイル選択時の処理
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            handleFile(event.target.files[0]);
        }
    };

    useEffect(() => {
        const dropArea = dropRef.current
        if(dropArea === null) return
        dropArea.addEventListener("dragover",(event) => {
            event.preventDefault()
            dropArea.classList.add("drag-over")
        })

        dropArea.addEventListener("dragleave",(event) => {
            event.preventDefault()
            dropArea.classList.remove("drag-over")
        })
        
        dropArea.addEventListener("drop",(event) => {
            event.preventDefault()
            dropArea.classList.remove("drag-over")
        })
    },[])
    return (
        <Modal open={isModalOpen}>
            <h2>PDFをアップロードしてください</h2>
            <div ref={dropRef} className="drop-zone">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pick a Your Slide File</legend>
                    <input type="file" className="file-input" accept="application/pdf" ref={inputRef} onChange={handleFileChange}/>
                </fieldset>
            </div>
        </Modal>
    )
}