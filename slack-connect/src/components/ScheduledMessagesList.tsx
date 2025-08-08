import React, { useState } from 'react';
import Modal from './Modal';

interface Message {
  id: string;
  channel_id: string;
  text: string;
  post_at: number; 
}

interface ScheduledMessagesListProps {
  messages: Message[];
  onCancel: (id: string) => void;
}

const ScheduledMessagesList: React.FC<ScheduledMessagesListProps> = ({ messages, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToCancel, setMessageToCancel] = useState<string | null>(null);

  const handleCancelClick = (id: string) => {
    setMessageToCancel(id);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (messageToCancel) {
      onCancel(messageToCancel);
      setMessageToCancel(null);
      setIsModalOpen(false);
    }
  };

  const formattedTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Your backend sends epoch seconds
    return date.toLocaleString();
  };

  if (messages.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
        No scheduled messages found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Scheduled Messages</h2>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">{message.text}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{message.channel_id}</span> at {formattedTime(message.post_at)}
              </div>
            </div>
            <button
              onClick={() => handleCancelClick(message.id.toString())}
              className="mt-2 sm:mt-0 py-1 px-3 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Message"
      >
        <p>Are you sure you want to cancel this scheduled message?</p>
      </Modal>
    </div>
  );
};

export default ScheduledMessagesList;