import React, { useState, useEffect } from 'react';
import { fetchChannels, sendNow, schedule } from '../services/api';

interface Channel {
  id: string;
  name: string;
}

const MessageForm: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isChannelsLoading, setIsChannelsLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllChannels = async () => {
      if (!teamId) return;

      try {
        const data = await fetchChannels(teamId);
        if (data.ok) {
          setChannels(data.channels);
          if (data.channels.length > 0) {
            setSelectedChannel(data.channels[0].id);
          }
        } else {
          console.error('Failed to fetch channels:', data.error);
          setStatusMessage({ type: 'error', text: `Failed to fetch channels: ${data.error}` });
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
        setStatusMessage({ type: 'error', text: 'An unexpected error occurred while fetching channels.' });
      } finally {
        setIsChannelsLoading(false);
      }
    };
    fetchAllChannels();
  }, [teamId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const team = urlParams.get('team_id');
    if (team) {
      setTeamId(team);
    }
  }, []);

  const handleSubmit = async (isScheduled: boolean) => {
    setIsLoading(true);
    setStatusMessage({ type: '', text: '' });

    if (!teamId) {
      setStatusMessage({ type: 'error', text: 'Team ID is missing.' });
      setIsLoading(false);
      return;
    }
    if (!selectedChannel || !message) {
      setStatusMessage({ type: 'error', text: 'Please select a channel and write a message.' });
      setIsLoading(false);
      return;
    }
    if (isScheduled && !scheduleTime) {
      setStatusMessage({ type: 'error', text: 'Please select a date and time to schedule.' });
      setIsLoading(false);
      return;
    }

    try {
      let result;
      if (isScheduled) {
        result = await schedule(teamId, selectedChannel, message, scheduleTime);
      } else {
        result = await sendNow(teamId, selectedChannel, message);
      }

      if (result.ok) {
        setStatusMessage({ type: 'success', text: isScheduled ? 'Message scheduled successfully.' : 'Message sent immediately.' });
        setMessage('');
        setScheduleTime('');
      } else {
        setStatusMessage({ type: 'error', text: `Failed to send message: ${result.error || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold mb-6 text-center">Send or Schedule a Message</h2>
      {statusMessage.text && (
        <div
          className={`p-4 rounded-lg mb-4 text-sm font-medium ${
            statusMessage.type === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="channel" className="block text-sm font-medium mb-1">
            Select Channel
          </label>
          <select
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            disabled={isChannelsLoading}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 transition-all duration-200"
          >
            {isChannelsLoading ? (
              <option>Loading channels...</option>
            ) : (
              channels.map((channel: Channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 transition-all duration-200"
            placeholder="Type your message here..."
          />
        </div>
        <div>
          <label htmlFor="scheduleTime" className="block text-sm font-medium mb-1">
            Schedule Time (Optional)
          </label>
          <input
            type="datetime-local"
            id="scheduleTime"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 transition-all duration-200"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="w-full flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
          >
            {isLoading ? 'Sending...' : 'Send Now'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="w-full flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:bg-green-300 dark:disabled:bg-green-800"
          >
            {isLoading ? 'Scheduling...' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;