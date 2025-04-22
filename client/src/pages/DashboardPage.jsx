import React, { useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
const DashboardPage = () => {
  const authUser = useSelector((state) => state.auth.authUser);
  const [name, setName] = useState(authUser.user.name || "");
  const [bio, setBio] = useState(authUser.user.bio || "");
  const [age, setAge] = useState(authUser.user.age || "");
  const [gender, setGender] = useState(authUser.user.gender || "");
  const [genderPreference, setGenderPreference] = useState(
    authUser.user.genderPreference || []
  );
  const [image, setImage] = useState(authUser.user.image || null);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
    </div>
  );
};

export default DashboardPage;
