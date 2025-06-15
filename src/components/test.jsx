import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Form from "./components/Form";
import Quiz from "./components/Quiz";
import Home from "./components/Home"
import { onAuthStateChanged,signOut } from "firebase/auth";
import { auth, db, addDoc, collection, getDocs, query, where } from "./firebase.js";

const App = () => {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState("auth");
  const [score, setScore] = useState(null);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setStage("form");
    });
    return () => unsubscribe();
  }, []);

  // On app load, log referral if present
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    const logged = localStorage.getItem(`ref_${ref}`);
    if (ref && !logged) {
      addDoc(collection(db, "referrals"), {
        referrer: ref,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
      localStorage.setItem(`ref_${ref}`, "true");
    }
  }, []);

  const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
      setStage("auth");
    };


  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?ref=${user.uid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Earn rewards!",
          text: "Take this quiz and win rewards!",
          url: shareUrl,
        });
        await addDoc(collection(db, "shares"), {
          userId: user.uid,
          timestamp: Date.now(),
        });
        const q = query(collection(db, "shares"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        setShareCount(snap.size);
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      window.open(`https://wa.me/?text=Take this quiz and win rewards! ${shareUrl}`, "_blank");
      await addDoc(collection(db, "shares"), {
        userId: user.uid,
        timestamp: Date.now(),
      });
      const q = query(collection(db, "shares"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setShareCount(snap.size);
    }
  };

  if (!user) return <Auth onAuthSuccess={() => setStage("form")} />;
  if (stage === "form") return <Form onNext={() => setStage("quiz")} />;
  if (stage === "quiz") return <Quiz onFinish={(s) => { setScore(s); setStage("result"); }} />;
  if (stage === "result") return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Add logout button here */}
      <div>
        <button
          onClick={handleLogout}
        
        >
          Logout
        </button>
      </div>

      {/* Conditional screens */}
      {stage === "form" && <Form onNext={() => setStage("quiz")} />}
      {stage === "quiz" && <Quiz onFinish={(s) => { setScore(s); setStage("result"); }} />}
      {stage === "result" && (
        <div>
          <p>Your score: {score}</p>
          <p>Share to WhatsApp Groups to redeem reward</p>
          <button onClick={handleShare}>
            Share on WhatsApp
          </button>
          <p>Shares: {shareCount}/10</p>
          {shareCount >= 10 && <p>You are eligible to redeem!</p>}
        </div>
      )}
    </div>
  );
};

export default App;
