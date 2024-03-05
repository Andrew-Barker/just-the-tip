import LocationComponent from './Location';
import Questionnaire from './Questionnaire';
import React, { useState, useEffect } from 'react';

const Receipt = () => {
  const [averageTipFromQuestions, setAverageTipFromQuestions] = useState(null);
  const [data, setData] = useState({minTip: '18', subTotal: ''});
  const [results, setResults] = useState({
    finalBillTotal: 0,
    finalTipAmount: 0,
    finalTipPercent: 0,
  });
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleTipMinChange = (event) => {
    setData(prevState => ({...prevState, minTip: event.target.value}));
  };

  const handleSubtotalChange = (event) => {
    let value = event.target.value;

    // Check if the value contains more than two decimal places
    const regex = /^\d+(\.\d{0,2})?$/;
    if (value === '' || regex.test(value)) {
      setData(prevState => ({...prevState, subTotal: event.target.value}));
    }
  };

  const handleQuestionnaireSubmit = (answers) => {
    // Calculate the average tip based on answers
    // Filter out null answers and calculate the average based on responses provided
    const filteredAnswers = answers.filter(answer => answer != null);
    const averageTip = filteredAnswers.length > 0
        ? (filteredAnswers.reduce((acc, curr) => acc + curr, 0) / filteredAnswers.length) * 100
        : 18; // Default to 18 or another default value if no answers were provided
    setData(prevState => ({...prevState, minTip: averageTip.toFixed(2)}));
    setAverageTipFromQuestions(averageTip.toFixed(2))
    setShowQuestionnaire(false); // Hide questionnaire after submission
  };


  useEffect(() => {
    const subTotal = Number(data.subTotal); // Ensure this is a number
    let minTipPercent = Number(data.minTip); // Convert to number in case it's coming from a select option as a string

    const finalBillTotal = Math.ceil(subTotal + subTotal * (minTipPercent / 100));
    const finalTipAmount = Number(finalBillTotal - subTotal).toFixed(2); // This will be a string, but that's okay for display
    const finalTipPercent = (Number(finalTipAmount) / subTotal) * 100;

    setResults({
      finalBillTotal,
      finalTipAmount,
      finalTipPercent: subTotal ? finalTipPercent.toFixed(2) : Number(0).toFixed(2), // Convert to fixed decimal place for display
    });
    }, [data]); // Add averageTipFromQuestions as a dependency


    return (
    <div className="grid max-w-md gap-4 p-4 mx-auto border border-gray-200 rounded-lg bg-white shadow-xl md:max-w-2xl md:p-8 md:gap-8">
      <div className="flex items-center justify-center gap-4">
        <img
          alt="Logo"
          className="rounded-md"
          height="64"
          src="/logo.jpeg"
          style={{
            aspectRatio: "64/64",
            objectFit: "cover",
          }}
          width="64"
        />
        <div className="text-sm">
          <h1 className="font-semibold">Just The Tip</h1>
          <address className="not-italic">
            69 Gratuity Grove
            <br />
            Tipville, OH 42069
          </address>
        </div>
      </div>
      <div className="flex items-center justify-center text-center border-t border-b py-4">
        <div className="text-sm">
          <div className="font-semibold">Receipt #01234</div>
          {/*<div>location</div>*/}
          <LocationComponent></LocationComponent>
          <div>{new Date().toLocaleString()}</div>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div>Desired Tip Minimum</div>
          <select className="w-24 min-w-24 text-right border border-gray-300 rounded-mds" value={data.minTip} onChange={handleTipMinChange}>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="18">18%</option>
            <option value="20">20%</option>
            <option value="22">22%</option>
            <option value="25">25%</option>
            {averageTipFromQuestions && <option value={averageTipFromQuestions}>{averageTipFromQuestions}%</option>}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-start text-xs">
        <div>
          <button onClick={() => setShowQuestionnaire(true)} className="flex items-center text-blue-500 hover:underline">
            Need Help Deciding Tip Percent?
          </button>
          {showQuestionnaire && <Questionnaire onSubmit={handleQuestionnaireSubmit} onClose={() => setShowQuestionnaire(false)}/>}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>Subtotal</div>
        <div className="flex items-center">
          <div className="flex items-center bg-white border border-gray-300 rounded-md">
            <span className="text-gray-500 pl-2">$</span>
            <input className="w-24 min-w-24 text-right outline-none pl-1 pr-2" type="number" min="0" placeholder="Bill subtotal" value={data.subTotal} onChange={handleSubtotalChange}/>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end text-xs">
        {process.env.REACT_APP_FEATURE_UPLOAD === 'true' && (
          <div>
            <button className="flex items-center text-blue-500 hover:underline">
              Upload Receipt
              <UploadIcon className="ml-2 h-4 w-4" />
            </button>
          </div>
          )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800" />
      <div className="flex items-center font-medium pt-6">
        <div>Tip Percentage</div>
        <div className="ml-auto">{results.finalTipPercent}%</div>
      </div>
      <div className="flex items-center font-medium py-2">
        <div>Tip Amount</div>
        <div className="ml-auto">${results.finalTipAmount}</div>
      </div>
      <div className="flex items-center font-medium pb-8">
        <div>Total</div>
        <div className="ml-auto">${results.finalBillTotal}</div>
      </div>
      <div className="flex items-start gap-4 text-sm">
        <div className="grid gap-1">
          <div>Thank you for using Just The Tip!</div>
          <div>Have a great day!</div>
        </div>
        <div className="grid gap-1 justify-items-end">
          <div>Just The Tip</div>
          <div>69 Gratuity Grove</div>
          <div>Tipville, OH 42069</div>
        </div>
      </div>
    </div>
    )
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
    )
}

export default Receipt;