const AddAccountPage = () => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">Account</span>
      <h2>Add account</h2>
    </div>

    <div className="page-list">
      <div className="page-item">
        <div className="history-row">
          <div className="history-icon">＋</div>
          <div className="history-copy">
            <strong>Google account</strong>
            <span>Connect a new profile to switch between accounts later.</span>
          </div>
        </div>
      </div>

      <div className="page-item">
        <div className="history-row">
          <div className="history-icon">📧</div>
          <div className="history-copy">
            <strong>Work email</strong>
            <span>Use your work identity for separate access.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AddAccountPage;
