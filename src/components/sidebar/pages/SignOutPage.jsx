const SignOutPage = ({ onSignOut }) => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">Session</span>
      <h2>Sign out</h2>
    </div>

    <div className="page-list">
      <div className="page-item">
        <div className="history-row">
          <div className="history-icon">🚪</div>
          <div className="history-copy">
            <strong>Log out of this device</strong>
            <span>You will need to sign in again to continue using Gemini.</span>
          </div>
        </div>
      </div>

      <button type="button" className="primary-action" onClick={onSignOut}>
        Sign out now
      </button>
    </div>
  </div>
);

export default SignOutPage;
