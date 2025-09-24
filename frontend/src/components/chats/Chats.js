import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../AppContext';
const Chats = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState();
  const { baseBackendRoute } = useContext(AppContext);
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };


  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      try {
        const response = await axios.post(`${baseBackendRoute}/api/chatbot/medical-chatbot`, {
          text: inputText
        });

        const responseData = response.data?.candidates[0]?.content?.parts[0]?.text || "Response from bot...";

        setMessages([
          ...messages,
          { text: inputText, sender: 'user' },
          { text: responseData, sender: 'bot' },
        ]);

        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm h-full w-full overflow-hidden flex flex-col items-center justify-between mx-auto relative">
      <div className="w-full px-5 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col mt-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex justify-${message.sender === 'user' ? 'end' : 'start'
                } mb-4`}
            >
              <div
                className={`${message.sender === 'user'
                  ? 'ml-auto rounded-bl-3xl rounded-tl-3xl rounded-tr-xl bg-green-700'
                  : 'mr-auto rounded-br-3xl rounded-tr-3xl rounded-tl-xl bg-green-400'
                  } py-3 px-4 text-white`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 w-full flex">
        <input
          type="text"
          id="default-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-0 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Type your text here..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
