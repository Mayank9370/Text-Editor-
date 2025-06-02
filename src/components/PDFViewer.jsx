import React from 'react';

const PdfViewer = ({ fileUrl }) => {
  return (
    <div className="pdf-viewer" style={{ width: '100%', height: '600px' }}>
      {fileUrl && <iframe src={fileUrl} width="100%" height="100%" title="PDF Viewer" />}
    </div>
  );
};

export default PdfViewer;
