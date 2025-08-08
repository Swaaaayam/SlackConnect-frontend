import React, { useState, useEffect } from 'react';
import MessageForm from './components/MessageForm';
import ScheduledMessagesList from './components/ScheduledMessagesList';
import { installUrl, listScheduled, cancelScheduled } from './services/api';

interface Message {
  id: string;
  channel_id: string;
  text: string;
  post_at: number;
}

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<Message[]>([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const team = urlParams.get('team_id');
      if (team) {
        setTeamId(team);
        setIsConnected(true);
        fetchScheduledMessages(team);
      } else {
        // Here we need an endpoint to check the status without a team_id,
        // but your backend doesn't have one. Assuming not connected if no team_id.
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  const fetchScheduledMessages = async (team: string) => {
    try {
      const data = await listScheduled(team);
      setScheduledMessages(data);
    } catch (error) {
      console.error('Failed to fetch scheduled messages:', error);
    }
  };

  const handleConnectClick = () => {
    window.location.href = installUrl;
  };

  const handleCancelMessage = async (id: string) => {
    try {
      const response = await cancelScheduled(id);
      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Message cancelled successfully.' });
        if (teamId) {
          fetchScheduledMessages(teamId);
        }
      } else {
        setStatusMessage({ type: 'error', text: `Failed to cancel message: ${response.error || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Error cancelling message:', error);
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-800 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-4xl space-y-8">
        {!isConnected ? (
          <div className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 text-center transform transition-all duration-300 hover:scale-105">
            <h1 className="text-3xl font-bold mb-4 text-white">Slack Connect</h1>
            <p className="mb-6 text-gray-200">Please connect to your Slack workspace to continue.</p>
            <button
              onClick={handleConnectClick}
              className="py-2 px-6 rounded-md shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:-translate-y-1"
            >
              Connect to Slack
            </button>
          </div>
        ) : (
          <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MessageForm />
              <ScheduledMessagesList messages={scheduledMessages} onCancel={handleCancelMessage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;