const SettingsPage = () => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">Settings</span>
      <h2>Preferences</h2>
    </div>

    <div className="settings-list">
      <div className="setting-row">
        <strong>Account</strong>
        <span className="toggle-pill" />
      </div>
      <div className="setting-row">
        <strong>Appearance</strong>
        <span className="toggle-pill" />
      </div>
      <div className="setting-row">
        <strong>Privacy</strong>
        <span className="toggle-pill" />
      </div>
    </div>
  </div>
);

export default SettingsPage;
