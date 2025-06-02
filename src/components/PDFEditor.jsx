import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import UploadArea from './UploadArea';
import PdfToolbar from './PdfToolbar';
import PdfViewer from './PdfViewer';

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [mode, setMode] = useState('none');
  const canvasRef = useRef(null);
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 });
  const isDrawing = useRef(false);

  useEffect(() => {
    const viewer = document.querySelector('.pdf-viewer');
    if (viewer) {
      setCanvasDims({ width: viewer.offsetWidth, height: viewer.offsetHeight });
    }
  }, [pdfUrl]);

  const handleFileUpload = async (file) => {
    const url = URL.createObjectURL(file);
    setPdfFile(file);
    setPdfUrl(url);
  };

  const handleAddText = async () => {
    if (!pdfFile) return;

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText('Your text here', {
        x: 50,
        y: firstPage.getHeight() - 50,
        size: 30,
        color: rgb(0.95, 0.1, 0.1),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl(newUrl);
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const applyCanvasToPdf = async () => {
    if (!pdfFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');
    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const pngImage = await pdfDoc.embedPng(imgData);
    const { width, height } = firstPage.getSize();

    firstPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const newUrl = URL.createObjectURL(blob);
    setPdfUrl(newUrl);
    setMode('none');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleMouseDown = (e) => {
    if (mode === 'none') return;
    isDrawing.current = true;
    draw(e);
  };

  const handleMouseMove = (e) => {
    if (isDrawing.current) {
      draw(e);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'blur') {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
      ctx.fillRect(x, y, 40, 40);
    } else if (mode === 'erase') {
      ctx.clearRect(x, y, 40, 40);
    }
  };

  const handleSavePdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'edited-pdf.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-editor" style={{ position: 'relative' }}>
      <UploadArea onFileUpload={handleFileUpload} />
      <PdfToolbar
        onAddText={handleAddText}
        onBlurSelection={() => setMode('blur')}
        onEraseSelection={() => setMode('erase')}
        onApplyCanvasToPdf={applyCanvasToPdf}
        onSavePdf={handleSavePdf}
        hasPdf={!!pdfFile}
      />
      <div style={{ position: 'relative' }}>
        <PdfViewer fileUrl={pdfUrl} />
        <canvas
          ref={canvasRef}
          width={canvasDims.width}
          height={canvasDims.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: mode !== 'none' ? 'auto' : 'none',
          }}
        />
      </div>
    </div>
  );
};
export default PdfEditor;