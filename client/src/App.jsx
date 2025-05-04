import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import { checkAuth } from "./reducers/authReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import BotPage from "./pages/BotPage";
const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage className="bg-red-500" />
            ) : (
              <Navigate to={"/auth"} />
            )
          }
        />
        <Route
          path="/auth"
          element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/ai-practice" element={<BotPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
