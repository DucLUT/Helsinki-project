import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import {
  fetchMessages,
  listenToMessages,
  unsubscribeToMessages,
} from "../reducers/messageReducer";
import { fetchMatches } from "../reducers/matchReducer";
import { useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { matches, isLoadingMyMatches } = useSelector((state) => state.match);
  const { messages } = useSelector((state) => state.message);
  const { id } = useParams();
  const match = matches.find((match) => match._id === id);

  useEffect(() => {
    if (authUser && id) {
      dispatch(fetchMatches());
      dispatch(fetchMessages(id));
      dispatch(listenToMessages());
    }
    return () => {
      dispatch(unsubscribeToMessages());
    };
  }, [dispatch, authUser, id]);

  if (isLoadingMyMatches) {
    return <LoadingMessagesUI />;
  }

  if (!match) {
    return <MatchNotFound />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
      <Header />
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-4 bg-white rounded-lg shadow p-3">
          <img
            src={match.image || "/avatar.png"}
            className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pink-300"
            alt="Match"
          />
          <h2 className="text-xl font-semibold text-gray-800">{match.name}</h2>
        </div>
        <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Shy? Let AI start your conversation with {match.name}
            </p>
          ) : (
            messages.map(
              (msg) => (
                console.log("Message", msg),
                (
                  <div
                    key={msg._id}
                    className={`mb-3 ${
                      msg.sender._id === authUser.user._id
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                        msg.sender._id === authUser.user._id
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                )
              )
            )
          )}
        </div>
        <MessageInput match={match} />
      </div>
    </div>
  );
};

export default ChatPage;

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <UserX size={64} className="mx-auto text-pink-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Match Not Found
      </h2>
      <p className="text-gray-600">
        Oops! It seems this match doesn&apos;t exist or has been removed.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors 
                focus:outline-none focus:ring-2 focus:ring-pink-300 inline-block"
      >
        Go Back To Home
      </a>
    </div>
  </div>
);

const LoadingMessagesUI = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <Loader size={48} className="mx-auto text-pink-500 animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Loading Chat
      </h2>
      <p className="text-gray-600">
        Please wait while we fetch your conversation...
      </p>
      <div className="mt-6 flex justify-center space-x-2">
        <div
          className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </div>
);
