const HistoryPage = ({ history = [], onOpenChat }) => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">History</span>
      <h2>Recent conversations</h2>
    </div>

    <div className="page-list">
      {history.length === 0 ? (
        <div className="page-item muted">
          <div className="history-row">
            <div className="history-icon">🕘</div>
            <div className="history-copy">
              <strong>No chats yet</strong>
              <span>Your recent prompts will appear here.</span>
            </div>
          </div>
        </div>
      ) : (
        history.map((chat) => (
          <button
            key={chat.id}
            type="button"
            className="page-item history-item"
            onClick={() => onOpenChat?.(chat)}
          >
            <div className="history-row">
              <div className="history-icon">💬</div>
              <div className="history-copy">
                <strong>{chat.prompt.length > 28 ? `${chat.prompt.slice(0, 28)}...` : chat.prompt}</strong>
                <span>{chat.response ? 'View response' : 'Open this chat'}</span>
              </div>
            </div>
            <span className="history-time">Chat</span>
          </button>
        ))
      )}
    </div>
  </div>
);

export default HistoryPage;
