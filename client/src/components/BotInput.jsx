import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../reducers/aiReducer";

const BotInput = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(sendMessage(input));
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex relative bg-white rounded-lg shadow p-3"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow p-3 rounded-l-lg border-2 border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="bg-pink-500 text-white p-3 rounded-r-lg hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        Send
      </button>
    </form>
  );
};

export default BotInput;
