// Questionnaire.js
import React, { useState, useEffect } from 'react';

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


const questions = [
  { text: 'Was your table ready in a timely manner?', type: 'yes_no', values: { Yes: 0.20, No: 0.10 } },
  { text: 'Was the waiting staff polite and attentive?', type: 'yes_no', values: { Yes: 0.25, No: 0.05 } },
  { text: 'Did the server explain the menu and specials clearly?', type: 'yes_no', values: { Yes: 0.15, No: 0.10 } },
  { text: 'Were your drinks refilled promptly?', type: 'yes_no', values: { Yes: 0.20, No: 0.10 } },
  { text: 'Did the staff accommodate any special requests or dietary needs?', type: 'yes_no', values: { Yes: 0.25, No: 0.10 } },
  { text: 'Was the waiting time for your food reasonable?', type: 'yes_no', values: { Yes: 0.20, No: 0.10 } },
  { text: 'Did the waiting staff check back to ensure your satisfaction with the meal?', type: 'yes_no', values: { Yes: 0.23, No: 0.08 } },
  { text: 'Was the order accurate without any mistakes?', type: 'yes_no', values: { Yes: 0.25, No: 0.05 } },
  { text: 'Were the payment and billing processes handled efficiently?', type: 'yes_no', values: { Yes: 0.20, No: 0.10 } },
  { text: 'Did the server suggest any desserts at the end of the meal?', type: 'yes_no', values: { Yes: 0.18, No: 0.12 } },
  { text: 'Rate the overall friendliness of the waiting staff.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the cleanliness and presentation of the table setting.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the overall taste and quality of the food.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the portion sizes of the dishes served.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the ambiance and comfort of the dining area.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the overall speed of service.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the knowledge of the server regarding the menu.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the variety and options available on the menu.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'Rate the temperature and freshness of your meal.', type: 'rating', values: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.18, 5: 0.22 } },
  { text: 'What was your group size?', type: 'multiple_choice', options: ['Alone', '2-4 people', '5-10 people', 'More than 10'], values: { 'Alone': 0.10, '2-4 people': 0.15, '5-10 people': 0.18, 'More than 10': 0.25 } },
  { text: 'What was the main reason for your satisfaction/dissatisfaction?', type: 'multiple_choice', options: ['Quality of food', 'Speed of service', 'Friendliness of staff', 'Price', 'Portion size'], values: { 'Quality of food': 0.10, 'Speed of service': 0.20, 'Friendliness of staff': 0.25, 'Price': 0.15, 'Portion size': 0.10 } },
  { text: 'Did you visit during a peak time?', type: 'yes_no', values: { Yes: 0.20, No: 0.15 } }
];


const initialAnswers = questions.map(() => null);

const Questionnaire = ({ onSubmit, onClose }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answersValue, setAnswersValue] = useState([]);
  
  useEffect(() => {
    const shuffledQuestions = shuffleArray([...questions]);
    const questionsForThisSession = shuffledQuestions.slice(0, 5);
    setSelectedQuestions(questionsForThisSession);
    setAnswers(new Array(questionsForThisSession.length).fill(null));
    setAnswersValue(new Array(questionsForThisSession.length).fill(null));
  }, []);

  const handleQuestionChange = (index, value) => {
    const newAnswers = [...answers];
    const newAnswersValues = [...answersValue];
    newAnswers[index] = value;
    newAnswersValues[index] = selectedQuestions[index].values[value];
    setAnswers(newAnswers);
    setAnswersValue(newAnswersValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-4xl space-y-4">
        <button onClick={onClose} className="absolute top-3 right-3 text-lg font-semibold text-gray-600 hover:text-gray-900">
          &times; {/* This is the 'X' button */}
        </button>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(answersValue);
        }}>
          {selectedQuestions.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg font-semibold">{question.text}</p>
              {question.type === 'yes_no' && (
                <div className="flex space-x-4 justify-start">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name={`question-${index}`}
                      value="Yes"
                      checked={answers[index] === 'Yes'}
                      onChange={() => handleQuestionChange(index, 'Yes')}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name={`question-${index}`}
                      value="No"
                      checked={answers[index] === 'No'}
                      onChange={() => handleQuestionChange(index, 'No')}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                )}
              {question.type === 'rating' && (
                <div className="flex space-x-4 justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name={`question-${index}`}
                        value={rating}
                        checked={answers[index] === rating}
                        onChange={() => handleQuestionChange(index, rating)}
                      /> 
                      <span className="ml-2">{rating}</span>
                    </label>
                    ))}
                </div>
                )}
              {question.type === 'multiple_choice' && (
                <div className={`grid grid-cols-2 md:grid-cols-${question.options.length > 4 ? 4 : question.options.length} gap-4`}>
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleQuestionChange(index, option)}
                      /> 
                      <span className="ml-2">{option}</span>
                    </label>
                    ))}
                </div>
                )}
            </div>
            ))}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black">
              Close
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white">
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default Questionnaire;
