// src/App.js
import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Form from "./components/Form";
import Quiz from "./components/Quiz";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, addDoc, collection, getDocs, query, where } from "./firebase";
import Logo from "./assets/logo.png"

const App = () => {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState("auth");
  const [score, setScore] = useState(null);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const attemptQuery = query(collection(db, "quizAttempts"), where("uid", "==", u.uid));
        const attemptSnap = await getDocs(attemptQuery);
        setStage(attemptSnap.empty ? "form" : "attempted");
      } else {
        setUser(null);
        setStage("auth");
      }
    });
    return () => unsubscribe();
  }, []);

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
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      window.open(`https://wa.me/?text=Take this quiz and win rewards! ${shareUrl}`, "_blank");
    }

    await addDoc(collection(db, "shares"), {
      userId: user.uid,
      timestamp: Date.now(),
    });

    const q = query(collection(db, "shares"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setShareCount(snap.size);
  };

  if (!user) {
    return <Auth onAuthSuccess={() => setStage("form")} />;
  }

  if (stage === "attempted") {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="card p-4 text-center shadow" style={{ maxWidth: "500px" }}>
          <h2 className="text-danger">Quiz Already Attempted</h2>
          <p>You’ve already completed the quiz and redeemed your reward.</p>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
           <img
                      src={Logo}
                      alt="QuizGrad Logo"
                      style={{ height: "80px", marginBottom: "20px" }}
                    />
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="container py-5">
        {stage === "form" && <Form onNext={() => setStage("quiz")} />}

        {stage === "quiz" && (
          <Quiz
            onFinish={async (s) => {
              setScore(s);
              setStage("result");
              await addDoc(collection(db, "quizAttempts"), {
                uid: user.uid,
                email: user.email,
                timestamp: Date.now(),
              });
            }}
          />
        )}

        {stage === "result" && (
          <div className="card p-4 text-center shadow" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 className="text-success">Quiz Completed</h2>
            <p className="lead">Your Score: <strong>{score}</strong></p>
            <p>Share to WhatsApp Groups to redeem your reward</p>
            <button className="btn btn-success mt-3" onClick={handleShare}>
              Share on WhatsApp
            </button>
            <p className="mt-2">Shares: {shareCount}/10</p>
            {shareCount >= 10 && (
              <p className="text-success fw-bold mt-2">You are eligible to redeem!</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
