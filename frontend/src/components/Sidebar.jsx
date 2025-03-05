// import React from 'react';

// const Sidebar = ({ onFileUpload }) => {
//   return (
//     <div className="w-1/4 bg-gray-100 h-screen p-5">
//       <h2 className="text-xl font-bold mb-4">Menu:</h2>
//       <p className="mb-4">Upload your PDF Files and Click on Submit & Process</p>
//       <div className="border border-dashed border-gray-400 rounded p-4 mb-4">
//         <input
//           type="file"
//           multiple
//           accept=".pdf"
//           onChange={onFileUpload}
//           className="hidden"
//           id="file-upload"
//         />
//         <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
//           Browse files
//         </label>
//         <p className="text-sm text-gray-500 mt-2">Limit: 20MB per file</p>
//       </div>
//       <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//         Submit & Process
//       </button>
//     </div>
//   );
// };

// export default Sidebar;



// // axios


import React from 'react';

const Sidebar = ({ onFileUpload, onSubmitAndProcess }) => {
  return (
    <div className="w-1/4 bg-gray-100 h-screen p-5">
      <h2 className="text-xl font-bold mb-4">Menu:</h2>
      <p className="mb-4">Upload your PDF Files and Click on Submit & Process</p>
      <div className="border border-dashed border-gray-400 rounded p-4 mb-4">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
          Browse files
        </label>
        <p className="text-sm text-gray-500 mt-2">Limit: 5 PDF files, 20MB per file</p>
      </div>
      <button onClick={onSubmitAndProcess} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Submit & Process
      </button>
    </div>
  );
};

export default Sidebar;
