import React from "react";
import TinderCard from "react-tinder-card";
import { useSelector, useDispatch } from "react-redux";

const CoreArea = () => {
  const dispatch = useDispatch();
  const { userProfiles } = useSelector((state) => state.match);
  const handleSwipe = (direction, user) => {
    if (direction === "right") {
      // Handle right swipe (like)
      console.log("Liked:", user);
      // Dispatch an action to update the match state
      // dispatch(likeUser(user._id));
    } else if (direction === "left") {
      // Handle left swipe (dislike)
      console.log("Disliked:", user);
      // Dispatch an action to update the match state
      // dispatch(dislikeUser(user._id));
    }
  };
  return (
    <div className="relative w-full max-w-sm h-[28rem]">
      {userProfiles.map((user) => (
        <TinderCard
          className="absolute shadow-none"
          key={user._id}
          onSwipe={(direction) => handleSwipe(direction, user)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={["up", "down"]}
        >
          <div
            className="card bg-white w-96 h-[28rem] select-none rounded-lg overflow-hidden border
					 border-gray-200"
          >
            <figure className="px-4 pt-4 h-3/4">
              <img
                src={user.image || "/avatar.png"}
                alt={user.name}
                className="rounded-lg object-cover h-full pointer-events-none"
              />
            </figure>
            <div className="card-body bg-gradient-to-b from-white to-pink-50">
              <h2 className="card-title text-2xl text-gray-800">
                {user.name}, {user.age}
              </h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default CoreArea;
