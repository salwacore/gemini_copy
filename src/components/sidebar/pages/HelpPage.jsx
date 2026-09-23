const HelpPage = () => (
  <div className="page-panel">
    <div className="page-header">
      <span className="eyebrow">Help</span>
      <h2>How can we help?</h2>
    </div>

    <div className="help-grid">
      <div className="info-card">
        <h3>Prompt writing</h3>
        <p>Use clearer instructions, context, and examples to get more accurate output.</p>
      </div>
      <div className="info-card">
        <h3>App usage</h3>
        <p>Ask for summaries, brainstorming, and code generation directly from the main input.</p>
      </div>
      <div className="info-card">
        <h3>Privacy</h3>
        <p>Review the app’s activity and account settings to manage your experience.</p>
      </div>
      <div className="info-card">
        <h3>Support</h3>
        <p>Use recent history or settings to quickly find categories and preferences.</p>
      </div>
    </div>
  </div>
);

export default HelpPage;
