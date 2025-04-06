import React from "react";
import { logOut } from "../reducers/authReducer";
import { useDispatch } from "react-redux";
const HomePage = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };
  return (
    <div className="bg-amber-700">
      HomePage
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 !bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:!bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Log out
      </button>
    </div>
  );
};

export default HomePage;
