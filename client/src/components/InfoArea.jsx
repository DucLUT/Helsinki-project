import React from "react";
import { useSelector } from "react-redux";
const getInfoStyle = (swipeFeedback) => {
  if (swipeFeedback === "liked") return "text-green-500";
  if (swipeFeedback === "passed") return "text-red-500";
  if (swipeFeedback === "matched") return "text-pink-500";
  return "";
};

const getInfoText = (swipeFeedback) => {
  if (swipeFeedback === "liked") return "Liked!";
  if (swipeFeedback === "passed") return "Passed";
  if (swipeFeedback === "matched") return "It's a Match!";
  return "";
};
const InfoArea = () => {
  const { info } = useSelector((state) => state.match);
  return (
    <div
      className={`
		absolute top-10 left-0 right-0 text-center text-2xl font-bold ${getInfoStyle(
      info
    )}
		`}
    >
      {getInfoText(info)}
    </div>
  );
};

export default InfoArea;
