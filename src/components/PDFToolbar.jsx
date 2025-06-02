import React from 'react';

const PdfToolbar = ({ onAddText, onBlurSelection, onEraseSelection, onApplyCanvasToPdf, onSavePdf, hasPdf }) => {
  return (
    <div className="pdf-toolbar">
      {hasPdf && (
        <>
          <button onClick={onAddText}>Add Text</button>
          <button onClick={onBlurSelection}>Blur</button>
          <button onClick={onEraseSelection}>Erase</button>
          <button onClick={onApplyCanvasToPdf}>Apply Edits</button>
          <button onClick={onSavePdf}>Save PDF</button>
        </>
      )}
    </div>
  );
};

export default PdfToolbar;
