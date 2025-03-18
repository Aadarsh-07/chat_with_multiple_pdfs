import React from 'react';

const Sidebar = ({ onFileUpload, onSubmitAndProcess, collections, selectedCollection, setSelectedCollection }) => {
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
      <button onClick={onSubmitAndProcess} className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
        Submit & Process
      </button>
      <div>
        <h3 className="font-bold mb-2">Select PDF Collection:</h3>
        <select 
          value={selectedCollection} 
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a collection</option>
          {collections.map((collection, index) => (
            <option key={index} value={collection}>{collection}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;


// // import React from 'react';

// // const Sidebar = ({ onFileUpload }) => {
// //   return (
// //     <div className="w-1/4 bg-gray-100 h-screen p-5">
// //       <h2 className="text-xl font-bold mb-4">Menu:</h2>
// //       <p className="mb-4">Upload your PDF Files and Click on Submit & Process</p>
// //       <div className="border border-dashed border-gray-400 rounded p-4 mb-4">
// //         <input
// //           type="file"
// //           multiple
// //           accept=".pdf"
// //           onChange={onFileUpload}
// //           className="hidden"
// //           id="file-upload"
// //         />
// //         <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
// //           Browse files
// //         </label>
// //         <p className="text-sm text-gray-500 mt-2">Limit: 20MB per file</p>
// //       </div>
// //       <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
// //         Submit & Process
// //       </button>
// //     </div>
// //   );
// // };

// // export default Sidebar;



// // // axios


// import React from 'react';

// const Sidebar = ({onFileUpload, onSubmitAndProcess }) => {
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
//         <p className="text-sm text-gray-500 mt-2">Limit: 5 PDF files, 20MB per file</p>
//       </div>
//       <button onClick={onSubmitAndProcess} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//         Submit & Process
//       </button>
//     </div>
//   );
// };

// export default Sidebar;
