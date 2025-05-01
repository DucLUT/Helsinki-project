import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfiles,
  listenToNewMatches,
  unsubscribeToNewMatches,
} from "../reducers/matchReducer";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Frown } from "lucide-react";
import CoreArea from "../components/CoreArea";
import InfoArea from "../components/InfoArea";

const HomePage = () => {
  // const dispatch = useDispatch();
  // const handleLogout = () => {
  //   dispatch(logOut());
  // };
  const dispatch = useDispatch();
  const { userProfiles, isLoadingUserProfiles } = useSelector(
    (state) => state.match
  );
  const { authUser } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUserProfiles());
  }, [dispatch]);
  console.log(
    "checking if this works for user profiles matchable: ",
    userProfiles
  );
  useEffect(() => {
    authUser && dispatch(listenToNewMatches());
    return () => {
      dispatch(unsubscribeToNewMatches());
    };
  }, [dispatch, authUser]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <main className="flex-grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden">
          {userProfiles.length > 0 && !isLoadingUserProfiles && (
            <>
              <InfoArea />
              <CoreArea />
              <InfoArea />
            </>
          )}

          {userProfiles.length === 0 && !isLoadingUserProfiles && (
            <NoMoreProfiles />
          )}

          {isLoadingUserProfiles && <LoadingUI />}
        </main>
      </div>
    </div>
  );
};

export default HomePage;

const NoMoreProfiles = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <Frown className="text-pink-400 mb-6" size={80} />
    <h2 className="text-3xl font-bold text-gray-800 mb-4">database draining</h2>
    <p className="text-xl text-gray-600 mb-6">No one likes u</p>
  </div>
);

const LoadingUI = () => {
  return (
    <div className="relative w-full max-w-sm h-[28rem]">
      <div className="card bg-white w-96 h-[28rem] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="px-4 pt-4 h-3/4">
          <div className="w-full h-full bg-gray-200 rounded-lg" />
        </div>
        <div className="card-body bg-gradient-to-b from-white to-pink-50 p-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};
