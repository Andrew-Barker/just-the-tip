import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import UploadIcon from './UploadIcon'; // Ensure this path is correct

const ReceiptScanner = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState('');
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            processImage(file);
            setIsOpen(false); // Close the modal after file selection
        }
    };

    const processImage = (imageFile) => {
        setIsProcessing(true);
        Tesseract.recognize(
            imageFile,
            'eng',
            {
                logger: (m) => console.log(m), // You can remove this logger in production
            }
        ).then(({ data: { text } }) => {
            setText(text);
            setIsProcessing(false);
        }).catch((error) => {
            console.error('Error:', error);
            setIsProcessing(false);
        });
    };

    return (
        <div>
            <button onClick={toggleModal} className="flex items-center text-brand-yellow-dark hover:text-brand-yellow-darker">
                Scan or Upload Receipt
                <UploadIcon className="ml-2 h-4 w-4 fill-current" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="relative bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4">
                        <button onClick={toggleModal} className="absolute top-3 right-3 text-lg font-semibold text-brand-yellow-dark hover:text-brand-yellow-darker">
                            &times; {/* This is the 'X' button */}
                        </button>
                        <div className="flex flex-col items-center">
                            <label htmlFor="receipt-upload" className="block text-sm font-medium text-gray-700 text-center mb-2">
                                Tap to scan or upload your receipt
                            </label>
                            <input id="receipt-upload" type="file" onChange={handleChange} capture="environment" accept="image/*" className="file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow-prominent file:text-white hover:file:bg-brand-yellow-dark cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}

            {isProcessing && <div className="text-center text-gray-500">Processing...</div>}
            {image && (
                <div className="mt-4 text-center">
                    <img src={image} alt="Scanned Receipt" className="max-w-xs max-h-96 inline-block" />
                    <textarea className="form-textarea mt-4 block w-full border-gray-300 rounded-md shadow-sm" 
                        value={text} readOnly rows="10" />
                </div>
                )}
        </div>
        );
};

export default ReceiptScanner;
