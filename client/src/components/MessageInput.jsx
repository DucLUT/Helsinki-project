import React, { useEffect, useRef, useState } from "react";
import { Send, Smile, Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { sendMessage } from "../reducers/messageReducer";
import { useDispatch, useSelector } from "react-redux";
import { generateSuggestion } from "../reducers/suggestReducer";

const MessageInput = ({ match }) => {
  const dispatch = useDispatch();
  const { suggestion, loading } = useSelector((state) => state.suggest); // Use loading from suggestReducer
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(sendMessage(match._id, message));
      setMessage("");
    }
  };

  const handleRizzClick = async () => {
    if (match.name) {
      dispatch(
        generateSuggestion({
          matchName: match.name,
          matchBio: match.bio,
        })
      );
    }
  };

  useEffect(() => {
    if (suggestion) {
      setMessage(suggestion); // Set the suggestion as the message when it arrives
    }
  }, [suggestion]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSendMessage} className="flex relative items-center">
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="ml-2 text-gray-400 hover:text-pink-500 focus:outline-none"
      >
        <Smile size={24} />
      </button>

      {/* Use Rizz Button */}
      <button
        type="button"
        onClick={handleRizzClick}
        className={`ml-2 px-2 py-1 text-sm rounded ${
          loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
        }`}
        disabled={loading} // Disable the button while loading
      >
        {loading ? <Loader className="animate-spin" size={16} /> : "Use Rizz"}
      </button>

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-3 mx-2 rounded-l-lg border-2 border-pink-500 
      focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="Type a message..."
      />

      {/* Send Button */}
      <button
        type="submit"
        className="bg-pink-500 text-white p-3 rounded-r-lg 
      hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        <Send size={24} />
      </button>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(emojiObject) =>
              setMessage((prevMessage) => prevMessage + emojiObject.emoji)
            }
          />
        </div>
      )}
    </form>
  );
};

export default MessageInput;
