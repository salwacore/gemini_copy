const ManageAccountsPage = () => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">Accounts</span>
      <h2>Manage accounts</h2>
    </div>

    <div className="page-list">
      <div className="page-item">
        <div className="history-row">
          <div className="history-icon">👤</div>
          <div className="history-copy">
            <strong>Primary account</strong>
            <span>Current active profile</span>
          </div>
        </div>
        <span className="history-time">Active</span>
      </div>

      <div className="page-item">
        <div className="history-row">
          <div className="history-icon">🧑‍💼</div>
          <div className="history-copy">
            <strong>Team account</strong>
            <span>Available for switching</span>
          </div>
        </div>
        <span className="history-time">2 profiles</span>
      </div>
    </div>
  </div>
);

export default ManageAccountsPage;
