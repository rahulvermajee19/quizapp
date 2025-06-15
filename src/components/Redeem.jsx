import React from "react";

const Redeem = ({ reward }) => (
  <div className="text-center mt-10">
    <h2 className="text-2xl font-bold">🎉 Congratulations!</h2>
    <p className="mt-4">You’ve earned: <strong>{reward}</strong></p>
    <p className="mt-2 text-sm text-gray-600">Check your email or rewards section to claim.</p>
  </div>
);

export default Redeem;
