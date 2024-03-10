import LocationComponent from './Location';
import Questionnaire from './Questionnaire';
import ReceiptScanner from './ReceiptScanner'; // Ensure this path matches where your component is located
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
    const finalTipAmount = Number(finalBillTotal - subTotal);
    const finalTipPercent = (Number(finalTipAmount) / subTotal) * 100;

    setResults({
      finalBillTotal: finalBillTotal.toLocaleString('en-US', { minimumFractionDigits: 0 }),
      finalTipAmount: finalTipAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
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
          <div className="font-semibold">Receipt #80085</div>
          {/*<div>location</div>*/}
          <LocationComponent></LocationComponent>
          <div>{new Date().toLocaleString()}</div>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div>Desired Tip Minimum</div>
          <select className="w-24 min-w-24 text-right bg-white border border-gray-300 rounded-md" value={data.minTip} onChange={handleTipMinChange}>
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
          <button onClick={() => setShowQuestionnaire(true)} className="flex items-center text-brand-yellow-dark hover:text-brand-yellow-darker hover:underline">
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
            <input className="w-24 min-w-28 text-right outline-none pl-1 pr-2 rounded-md" type="number" min="0" placeholder="Bill subtotal" value={data.subTotal} onChange={handleSubtotalChange}/>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end text-xs">
        {process.env.REACT_APP_FEATURE_UPLOAD === 'true' && (
          <div>
            <ReceiptScanner />
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
        <div className="grid gap-1 justify-items-end text-[9px]">
          <div>NULL__P01NT3R presents</div>
          <div><span className="underline">Just The Tip</span> © {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
    )
}

export default Receipt;