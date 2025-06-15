// src/components/Result.js
import React from "react";

const Result = ({ score, onShare, shareCount }) => {
  return (
    <div className="text-center mt-10">
      <p className="text-xl">Your score: {score}</p>
      <p className="mt-4">Share to WhatsApp Groups to redeem reward</p>
      <button onClick={onShare} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
        Share on WhatsApp
      </button>
      <p className="mt-2">Shares: {shareCount}/10</p>
      {shareCount >= 10 && <p className="text-green-600 mt-4">You are eligible to redeem!</p>}
    </div>
  );
};

export default Result;
