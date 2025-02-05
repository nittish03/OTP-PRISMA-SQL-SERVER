"use client";
import React, { useState } from "react";
import { Bell, AlertTriangleIcon } from "lucide-react";

const SOS = ({ sendSOS }) => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [SOSMessage, setSOSMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentSOS, setCurrentSOS] = useState("");

  const handleSendSOS = () => {
    if (SOSMessage.trim() !== "") {
      setCurrentSOS(SOSMessage);
      setShowAlert(true);
      setShowSOSModal(false);
    //   sendSOS(SOSMessage); // Function to send SOS globally
      setSOSMessage("");
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center animate-pulse">
          <AlertTriangleIcon className="mr-2 h-8 w-8" />
          <div>
            <strong>SOS:</strong> {currentSOS}
          </div>
          <button
            onClick={closeAlert}
            className="ml-4 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="fixed bottom-4 right-20 z-50">
        <button
          onClick={() => setShowSOSModal(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        >
          <Bell size={24} />
        </button>
      </div>

      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-white">
            <h2 className="text-2xl mb-4">Send SOS Message</h2>
            <textarea
              placeholder="Enter SOS message..."
              onChange={(e) => setSOSMessage(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white rounded mb-4 focus:ring-2 focus:ring-blue-600"
              rows="3"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowSOSModal(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSOS}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Send SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOS;
