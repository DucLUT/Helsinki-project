import React, { useState, useEffect } from "react";
import { Heart, Loader, MessageCircle, X, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatches } from "../reducers/matchReducer";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const dispatch = useDispatch();
  const { matches, isLoadingMyMatches } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  return (
    <>
      <div
        className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-1/4
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 pb-[27px] border-b border-pink-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-pink-600">Matches</h2>
            <button
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Matches Section */}
          <div className="flex-grow overflow-y-auto p-4 z-10 relative bg-gray-50">
            {isLoadingMyMatches ? (
              <LoadingState />
            ) : matches.length === 0 ? (
              <NoMatchesFound />
            ) : (
              matches.map((match) => (
                <Link key={match._id} to={`/chat/${match._id}`}>
                  <div
                    className="flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-2 
                rounded-lg transition-colors duration-300"
                  >
                    <img
                      src={match.image || "/avatar.png"}
                      alt="User avatar"
                      className="size-12 object-cover rounded-full mr-3 border-2 border-pink-200"
                    />
                    <h3 className="font-semibold text-gray-800">
                      {match.name}
                    </h3>
                    <MessageCircle
                      className="ml-auto text-pink-400"
                      size={22}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer or anything else */}
          <div className="bg-purple-400 p-3 flex items-center justify-center">
            <Link to="/ai-practice">
              <button className="w-full py-2 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300">
                <Bot />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-0"
        onClick={toggleSidebar}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <Heart className="text-purple-400 mb-4" size={48} />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Yet</h3>
    <p className="text-gray-500 max-w-xs">Keep swiping!</p>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <Loader className="text-purple-500 mb-4 animate-spin" size={48} />
    <h3 className="text-xl font-semibold text-purple-700 mb-2">
      Loading Matches
    </h3>
    <p className="text-gray-500 max-w-xs">This might take a moment</p>
  </div>
);
