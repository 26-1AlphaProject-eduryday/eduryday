'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  bucket: 'assignment-files' | 'lesson-materials' | 'submission-files';
  accept?: string;
  maxSizeMB?: number;
  onUploaded?: (fileUrl: string, filename: string) => void;
  className?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export function FileUpload({
  bucket,
  accept = '.pdf,.zip,.py,.java,.cpp,.js,.ts,.tsx,.jsx,.docx,.pptx,.md,.txt,.png,.jpg,.jpeg',
  maxSizeMB = 10,
  onUploaded,
  className = '',
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>({ status: 'idle' });
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setState({ status: 'error', message: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.` });
      return;
    }

    setFileName(file.name);
    setState({ status: 'uploading', progress: 0 });

    try {
      // Step 1: Get signed URL
      const signedRes = await fetch('/api/v1/upload/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, filename: file.name, size: file.size }),
      });

      const signedJson = await signedRes.json();
      if (!signedJson.ok) {
        setState({ status: 'error', message: signedJson.message ?? '업로드 URL 생성 실패' });
        return;
      }

      // Step 2: Upload to signed URL
      const uploadRes = await fetch(signedJson.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!uploadRes.ok) {
        setState({ status: 'error', message: '파일 업로드 실패' });
        return;
      }

      const path = signedJson.data.path as string;
      setState({ status: 'success', message: '업로드 완료' });
      onUploaded?.(path, file.name);
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : '업로드 오류' });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-gray-400 hover:bg-gray-100"
        role="button"
        tabIndex={0}
        aria-label="파일 선택 또는 드래그"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />
        {state.status === 'idle' && (
          <>
            <p className="text-sm font-medium text-gray-700">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="mt-1 text-xs text-gray-500">최대 {maxSizeMB}MB · {accept}</p>
          </>
        )}
        {state.status === 'uploading' && (
          <>
            <p className="text-sm font-medium text-gray-700">업로드 중...</p>
            <p className="mt-1 text-xs text-gray-500">{fileName}</p>
          </>
        )}
        {state.status === 'success' && (
          <>
            <p className="text-sm font-medium text-green-600">&#10003; {state.message}</p>
            <p className="mt-1 text-xs text-gray-500">{fileName}</p>
          </>
        )}
        {state.status === 'error' && (
          <>
            <p className="text-sm font-medium text-red-600">&#10007; {state.message}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setState({ status: 'idle' }); setFileName(''); }}
              className="mt-2 text-xs text-gray-600 underline"
            >
              다시 시도
            </button>
          </>
        )}
      </div>
    </div>
  );
}
