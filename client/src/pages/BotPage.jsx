import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { clearMessages } from "../reducers/aiReducer";
import { Loader } from "lucide-react";
import BotInput from "../components/BotInput";

const BotPage = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    // Clear messages when the component is unmounted
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
      <Header />
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
        <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
          {loading && (
            <div className="text-center text-gray-500">
              <Loader className="animate-spin mx-auto mb-4" size={32} />
              <p>Bot is thinking...</p>
            </div>
          )}
          {messages.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">
              Start a conversation with the bot!
            </p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                  msg.sender === "user"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <BotInput />
      </div>
    </div>
  );
};

export default BotPage;
