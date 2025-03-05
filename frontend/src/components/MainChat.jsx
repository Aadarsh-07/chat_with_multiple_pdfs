// import React, { useState } from 'react';

// const MainChat = ({ onQuestionSubmit }) => {
//   const [question, setQuestion] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (question.trim()) {
//       onQuestionSubmit(question);
//       setQuestion('');
//     }
//   };

//   return (
//     <div className="w-3/4 p-5">
//       <h1 className="text-3xl font-bold mb-6">Chat with PDF using Gemini 💁</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask a Question from the PDF Files"
//           className="w-full border border-gray-300 rounded p-3 mb-4"
//         />
//         <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
//           Ask
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MainChat;


import React, { useState } from 'react';

const MainChat = ({ onQuestionSubmit, response }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onQuestionSubmit(question);
      setQuestion('');
    }
  };

  return (
    <div className="w-3/4 p-5">
      <h1 className="text-3xl font-bold mb-6">Chat with PDF using Groq 💁</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a Question from the PDF Files"
          className="w-full border border-gray-300 rounded p-3 mb-4"
        />
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
          Ask
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default MainChat;

