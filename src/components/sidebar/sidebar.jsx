import React, { useContext } from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';

const Sidebar = ({ activeView, setActiveView }) => {
  const { chatHistory, startNewChat, openChat } = useContext(Context);
  const [extended, setExtended] = React.useState(false);

  const navItems = [
    { key: 'history', label: 'History', icon: assets.MESSAGE },
    { key: 'help', label: 'Help', icon: assets.ques },
    { key: 'activity', label: 'Activity', icon: assets.images },
    { key: 'settings', label: 'Settings', icon: assets.setting },
  ];

  const handleNavClick = (key) => {
    setActiveView(key);
  };

  return (
    <div className={`sidebar ${extended ? 'expanded' : 'collapsed'}`}>
      <div className="top">
        <div className="sidebar-brand-row">
          <button
            type="button"
            className="menu-button"
            onClick={() => setExtended(!extended)}
            aria-label={extended ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <img className="menu" src={assets.menu} alt="Menu" />
          </button>

          <div className="sidebar-brand">
            {extended && <span>Gemini</span>}
          </div>
        </div>

        <button
          type="button"
          className={`newchat ${activeView === 'main' ? 'active' : ''}`}
          onClick={() => {
            startNewChat();
            setActiveView('main');
          }}
        >
          <img src={assets.plus} alt="New chat" />
          {extended && <p>New Chat</p>}
        </button>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {chatHistory.length === 0 ? (
              <div className="recent-entry muted">
                <p>No chats yet</p>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  className="recent-entry"
                  onClick={() => {
                    openChat(chat);
                    setActiveView('main');
                  }}
                >
                  <img src={assets.MESSAGE} alt="" />
                  <p>{chat.prompt.length > 18 ? `${chat.prompt.slice(0, 18)}...` : chat.prompt}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="bottom">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            className={`bottom-items ${activeView === key ? 'active' : ''}`}
            onClick={() => handleNavClick(key)}
          >
            <img src={icon} alt={label} />
            {extended && <p>{label}</p>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;