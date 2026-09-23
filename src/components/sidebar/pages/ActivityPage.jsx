import { useContext } from 'react';
import { Context } from '../../../context/context';

const ActivityPage = () => {
  const { chatHistory = [] } = useContext(Context);

  const prompts = chatHistory.slice(0, 5);
  const totalPrompts = chatHistory.length;

  return (
    <div className="page-panel">
      <div className="page-header">
        <span className="eyebrow">Activity</span>
        <h2>Your recent activity</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{totalPrompts}</strong>
          <span>Prompts</span>
        </div>
        <div className="stat-card">
          <strong>{Math.max(0, totalPrompts - 1)}</strong>
          <span>Responses</span>
        </div>
        <div className="stat-card">
          <strong>{prompts.length}</strong>
          <span>Recent chats</span>
        </div>
      </div>

      <div className="timeline-list">
        {prompts.length === 0 ? (
          <div className="timeline-item">
            <span className="timeline-dot" />
            <p>No prompts yet. Start a new chat to see your activity here.</p>
          </div>
        ) : (
          prompts.map((chat, index) => (
            <div key={chat.id ?? `${chat.prompt}-${index}`} className="timeline-item">
              <span className="timeline-dot" />
              <p>{chat.prompt.length > 120 ? `${chat.prompt.slice(0, 120)}...` : chat.prompt}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
