import React from 'react';

const UploadArea = ({ onFileUpload }) => {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-area">
      <input type="file" accept="application/pdf" onChange={handleChange} />
    </div>
  );
};

export default UploadArea;
