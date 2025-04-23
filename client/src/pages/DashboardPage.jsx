import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../reducers/userReducer";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [genderPreference, setGenderPreference] = useState([]);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser?.user) {
      setName(authUser.user.name || "");
      setBio(authUser.user.bio || "");
      setAge(authUser.user.age || "");
      setGender(authUser.user.gender || "");
      setGenderPreference(authUser.user.genderPreference || []);
      setImage(authUser.user.image || null);
    }
  }, [authUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({ name, bio, age, gender, genderPreference, image })
    );
  };

  // ✅ Now we put this AFTER all hook calls
  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Your Profile
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300
                      rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 
                      sm:text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
