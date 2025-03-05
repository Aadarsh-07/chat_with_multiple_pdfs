// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import MainChat from './components/MainChat';

// function App() {
//   const [files, setFiles] = useState([]);
//   const [response, setResponse] = useState('');

//   const handleFileUpload = (e) => {
//     const uploadedFiles = Array.from(e.target.files).slice(0, 5);
//     setFiles(uploadedFiles);
//     console.log(uploadedFiles);
    
//   };

//   const handleQuestionSubmit = async (question) => {
//     // Simulate API call for question-answering
//     console.log('User Question:', question);
//     setResponse(`Simulated response for: "${question}"`);
//   };

//   return (
//     <div className="flex">
//       <Sidebar onFileUpload={handleFileUpload} />
//       <MainChat onQuestionSubmit={handleQuestionSubmit} />
//     </div>
//   );
// }

// export default App;



import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import { uploadFiles, searchQuery } from './utils/api'

function App() {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(uploadedFiles);
  };

  const handleSubmitAndProcess = async () => {
    const result = await uploadFiles(files);
    if (result.success) {
      setIsUploaded(true);
    }
  };

  const handleQuestionSubmit = async (question) => {
    const answer = await searchQuery(question);
    setResponse(answer);
  };

  return (
    <div className="flex">
      <Sidebar onFileUpload={handleFileUpload} onSubmitAndProcess={handleSubmitAndProcess} />
      {isUploaded && <MainChat onQuestionSubmit={handleQuestionSubmit} response={response} />}
    </div>
  );
}

export default App;
