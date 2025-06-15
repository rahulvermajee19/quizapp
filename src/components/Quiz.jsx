// src/components/Quiz.js
import React, { useState, useEffect } from "react";
import questions from "../data";
import "./Quiz.css";

const Quiz = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(60);
  const [answered, setAnswered] = useState(false);

  const q = questions[current];

  const handleSelectOption = (opt) => {
    setSelected(opt);
    setAnswered(true);
  };

  const handleNext = () => {
    if (selected) {
      if (selected === q.answer) setScore(score + 1);
    }

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setSelected(null);
      setAnswered(false);
      setTimer(60); // Reset timer
    } else {
      onFinish(score + (selected === q.answer ? 1 : 0));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1 && !answered) {
          handleNext(); // auto skip if time runs out
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, answered]); // timer resets only when question updates

  return (
    <div className="quiz-wrapper container-fluid">
      <div className="row">
        {/* Progress Bar */}
        <div className="col-12 text-center mb-4">
          <div className="quiz-progress">
            {questions.map((_, i) => (
              <div key={i} className={`step ${i <= current ? "active" : ""}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="col-12">
          <div className="question-box mb-4 p-4">
            <h4 className="question-text">{q.question}</h4>
          </div>
        </div>

        {/* Options */}
        <div className="col-12 d-flex flex-wrap justify-content-center gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className={`option-box ${selected === opt ? "selected" : ""}`}
            >
              <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
            </button>
          ))}
        </div>

        {/* Footer Controls */}
        <div className="col-12 d-flex justify-content-between align-items-center mt-4 px-3 flex-wrap gap-3">
          <button
            className="btn btn-secondary"
            disabled={current === 0}
            onClick={() => {
              setCurrent((prev) => prev - 1);
              setSelected(null);
              setTimer(60);
              setAnswered(false);
            }}
          >
            ◀ Previous
          </button>

          <div className="timer-icon">
            <span>{timer}</span>
          </div>

          <button
            className="btn btn-warning"
            onClick={handleNext}
            disabled={!answered}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
