import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false); 
  const [uploaded, setUploaded] = useState(false)
  const[questionMessage, setquestionMessage] = useState("")

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Files uploaded and processed successfully!");
      setUploaded(true);
    } catch (error) {
      console.log(error)
      setMessage("Failed to upload files. Please try again.");
      setUploaded(false);
    } finally {
      setUploading(false);
      dismissMessage();
    }
  };

  const handleQuestionSubmit = async () => {

    if (!question) {
      setquestionMessage("Please enter a question.");
      dismissquestionMessage()
      return;
    }

    if (files.length === 0) {
      alert("Please upload files before submitting a question.");
      return;
    }

    setSubmittingQuestion(true); 

    try {
      const response = await axios.post("http://localhost:8000/ask/", { question });
      setAnswer(response.data.answer);
    } catch (error) {
      setMessage("Failed to upload files. Please try again.");
    } finally {
      setSubmittingQuestion(false); 
    }
  };

  const dismissMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const dismissquestionMessage = () => {
    setTimeout(() => {
      setquestionMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-800 text-gray-100 p-4">
        <h1 className="text-2xl font-bold mt-4 mb-4">PDF Assistant</h1>
        <div className="relative mb-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
         
          <div className="flex justify-between cursor-pointer items-center
           bg-slate-700 rounded-lg p-3">
            <span className="text-gray-300">Choose File</span>
            <span className="text-gray-300">{files.length} file(s) selected</span>
          </div>
          <div className="mt-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between
               bg-gray-700 rounded-md px-3 py-2 mb-2">
                <span className="text-gray-300">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleUpload}
          className={`bg-blue-500 hover:bg-blue-600
             text-white px-4 py-2 rounded-md w-full ${uploading || files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading || files.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        {message && (
          <div className="mt-2 text-sm text-gray-500">{message}</div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-4">
          <h1 className="mb-6 text-center font-sans font-bold text-3xl">
            PDF Assistant
          </h1>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question"
            className="w-full border mb-5 border-gray-300 rounded-md px-4 py-2"
            required
          />
           {questionMessage && (
            <div className="text-red-500 mb-4">{questionMessage}</div>
          )}
          <div className='flex items-center justify-center'>
            <button
              onClick={handleQuestionSubmit}
              className={`bg-green-500 items-center flex justify-center hover:bg-green-600 text-white px-4 py-2 mt-5 md:mt-0 md:ml-2 rounded-md w-full md:w-auto ${files.length === 0 || !uploaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!uploaded || submittingQuestion}
            >
              {submittingQuestion ? 'Processing...' : 'Submit Question'}
            </button>
          </div>
        </div>
        {answer && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

