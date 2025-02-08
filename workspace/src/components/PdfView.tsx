import { useRef } from "react";
import DragDrop from "./DragDrop";

export default function PdfProcessor() {

    // Input Data Ref
    const inputRef = useRef<HTMLInputElement>(null);

    // Iframe Element Ref
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className="flex flex-col bg-slate-200">
            {/* PDF表示 */}
            <iframe ref={iframeRef} hidden width="100%" height="300px" title="PDF Viewer" />

            {/* ファイルアップロード */}
            <DragDrop inputRef={inputRef} iframeRef={iframeRef}/>
            {/* テキスト抽出結果（デバッグ用） */}
            {/*<textarea value={text} readOnly rows={10} cols={50} /> */}
            
            <div id="result"/>
        </div>
    );
}
