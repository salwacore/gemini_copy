import { useContext, useEffect } from 'react';
import './MAINCSSPAGE.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/context';
import HistoryPage from '../sidebar/pages/HistoryPage';
import ActivityPage from '../sidebar/pages/ActivityPage';
import HelpPage from '../sidebar/pages/HelpPage';
import SettingsPage from '../sidebar/pages/SettingsPage';
import AddAccountPage from '../sidebar/pages/AddAccountPage';
import ManageAccountsPage from '../sidebar/pages/ManageAccountsPage';
import SignOutPage from '../sidebar/pages/SignOutPage';

const createUserAvatar = (nameOrEmail = 'User') => {
  const baseLabel = (nameOrEmail || 'User').trim();
  const initials = baseLabel
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';

  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="64" fill="${color}"/>
      <circle cx="64" cy="48" r="20" fill="#ffffff" opacity="0.96"/>
      <path d="M34 100c6-16 22-25 30-25s24 9 30 25" fill="#ffffff" opacity="0.96"/>
      <text x="64" y="118" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `)}`;
};

const getProfileAvatar = (userData) => {
  const avatarUrl = userData?.user_metadata?.avatar_url || userData?.avatar_url || userData?.picture;
  if (avatarUrl) {
    return avatarUrl;
  }

  const label = userData?.email || userData?.user_metadata?.full_name || 'User';
  return createUserAvatar(label);
};

const Main = ({ activeView, setActiveView, accountMenuOpen, setAccountMenuOpen, onSignOut, session }) => {
  const { onSent, showResults, loading, setInput, input, resultData, currentPrompt, recentPrompts, chatHistory, openChat, user } = useContext(Context);
  const activeUser = user ?? session?.user ?? null;

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [activeView, setAccountMenuOpen]);

  const promptCards = [
    { title: 'Directions', text: 'Find the best route to a new place', icon: assets.compass },
    { title: 'Code', text: 'Write a small app or fix a bug', icon: assets.code },
    { title: 'Images', text: 'Create a visual concept for a product', icon: assets.gallery2 },
    { title: 'New ideas', text: 'Brainstorm creative options or plans', icon: assets.bulb },
  ];

  const handleSend = async (promptText = input) => {
    const prompt = promptText?.trim();
    if (!prompt) {
      console.log('Type something first');
      return;
    }

    setActiveView('main');
    await onSent(prompt);
  };

  const handlePromptCardClick = async (promptText) => {
    setInput(promptText);
    await handleSend(promptText);
  };

  const isConversationActive = loading || showResults;
  const showPromptCards = activeView === 'main' && !isConversationActive && !currentPrompt && chatHistory.length === 0;
  const showComposer = activeView === 'main';

  const stripMarkdownFormatting = (value = '') =>
    value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(?=\S)/g, '')
      .replace(/(?<=\S)\*(?!\*)/g, '')
      .replace(/^\s*#{1,6}\s*/gm, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .trim();

  const renderInlineMarkdown = (value = '') => {
    const cleanValue = stripMarkdownFormatting(value);

    return <span>{cleanValue}</span>;
  };

  const renderResponse = (text) => {
    if (!text) {
      return <p>No response yet.</p>;
    }

    const parts = text.split(/```([\s\S]*?)```/);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <pre key={`code-${index}`} className="code-block">
            <code>{part}</code>
          </pre>
        );
      }

      if (!part.trim()) {
        return null;
      }

      const lines = part.split('\n');

      return (
        <div key={`text-${index}`} className="markdown-block">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              return <div key={`empty-${lineIndex}`} className="markdown-spacer" />;
            }

            if (/^\*\*[^*].*[^*]\*\*$/.test(trimmedLine)) {
              return (
                <h3 key={`heading-${lineIndex}`} className="markdown-heading">
                  {trimmedLine.replace(/^\*\*|\*\*$/g, '')}
                </h3>
              );
            }

            if (/^#+\s+/.test(trimmedLine)) {
              return (
                <h3 key={`heading-${lineIndex}`} className="markdown-heading">
                  {trimmedLine.replace(/^#+\s+/, '')}
                </h3>
              );
            }

            return (
              <p key={`paragraph-${lineIndex}`} className="markdown-paragraph">
                {renderInlineMarkdown(trimmedLine)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const handleAccountMenuAction = (pageKey) => {
    setAccountMenuOpen(false);
    setActiveView(pageKey);
  };

  const renderPageContent = () => {
    switch (activeView) {
      case 'history':
        return (
          <HistoryPage
            history={chatHistory}
            onOpenChat={(chat) => {
              openChat(chat);
              setActiveView('main');
            }}
          />
        );
      case 'help':
        return <HelpPage />;
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage />;
      case 'add-account':
        return <AddAccountPage />;
      case 'manage-accounts':
        return <ManageAccountsPage />;
      case 'sign-out':
        return <SignOutPage onSignOut={onSignOut} />;
      default:
        return null;
    }
  };

  if (activeView !== 'main') {
    return (
      <main className="main page-main">
        <header className="main-header">
          <div className="brand" aria-label="Gemini brand">
            <span>Gemini</span>
          </div>

          <div
            className="profile-wrap"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setAccountMenuOpen((prev) => !prev);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Account menu"
          >
            <img src={getProfileAvatar(activeUser)} alt="Profile" />
            {accountMenuOpen && (
              <div className="account-menu" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => handleAccountMenuAction('add-account')}>Add account</button>
                <button type="button" onClick={() => handleAccountMenuAction('manage-accounts')}>Manage accounts</button>
                <button type="button" onClick={() => handleAccountMenuAction('sign-out')}>Sign out</button>
              </div>
            )}
          </div>
        </header>

        <section className="page-layout">
          <div className="page-shell">{renderPageContent()}</div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <header className="main-header">
        <div className="brand" aria-label="Gemini brand">
          <span>Gemini</span>
        </div>

        <div
          className="profile-wrap"
          onClick={() => setAccountMenuOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setAccountMenuOpen((prev) => !prev);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Account menu"
        >
          <img src={getProfileAvatar(activeUser)} alt="Profile" />
          {accountMenuOpen && (
            <div className="account-menu" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => handleAccountMenuAction('add-account')}>Add account</button>
              <button type="button" onClick={() => handleAccountMenuAction('manage-accounts')}>Manage accounts</button>
              <button type="button" onClick={() => handleAccountMenuAction('sign-out')}>Sign out</button>
            </div>
          )}
        </div>
      </header>

      <section
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        {!loading && !showResults && (
          <div className="welcome-box">
            <div className="brand-badge">
              <img src={assets.gem} alt="Gemini" className="brand-badge-logo" />
            </div>
            <h1>How can I help you today?</h1>
          </div>
        )}

        {showPromptCards && (
          <div className="prompt-cards">
            {promptCards.map((card) => (
              <article
                key={card.title}
                className="prompt-card"
                onClick={() => handlePromptCardClick(card.text)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePromptCardClick(card.text);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <img src={card.icon} alt={card.title} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {showResults && (
          <div
            className="chat-thread"
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              width: 'min(930px, 100%)',
              margin: '0 auto',
              paddingBottom: '12px'
            }}
          >
            {currentPrompt && (
              <div className="chat-row user-row">
                <div className="chat-avatar user-avatar">
                  <img src={getProfileAvatar(activeUser)} alt="You" />
                </div>
                <div className="chat-bubble user-bubble">
                  <p>{currentPrompt}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="chat-row assistant-row" aria-live="polite">
                <div className="chat-avatar gemini-avatar">
                  <img src={assets.gem} alt="Gemini logo" />
                </div>

                <div className="chat-bubble assistant-bubble loading-bubble">
                  <div className="loading-lines" aria-label="Loading response">
                    <span className="loading-line line-1" />
                    <span className="loading-line line-2" />
                    <span className="loading-line line-3" />
                    <span className="loading-line line-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat-row assistant-row">
                <div className="chat-avatar gemini-avatar">
                  <img src={assets.gem} alt="Gemini logo" />
                </div>

                <div className="chat-bubble assistant-bubble">
                  {renderResponse(resultData)}
                </div>
              </div>
            )}
          </div>
        )}

        {showComposer && (
          <div
            className="composer-wrap"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 'auto',
              paddingTop: '8px',
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              background: 'rgba(247, 248, 250, 0.85)',
              backdropFilter: 'blur(8px)',
              flexShrink: 0
            }}
          >
            <div className="composer-box">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                type="text"
                placeholder="Enter a prompt here"
              />

              <div className="composer-actions">
                <button type="button" className="tool-btn" aria-label="Add image">
                  <img src={assets.gallery2} alt="Image" />
                </button>
                <button type="button" className="tool-btn" aria-label="Add media">
                  <img src={assets.plus} alt="Plus" />
                </button>
                <button type="button" className="tool-btn" aria-label="Microphone">
                  <img src={assets.mic} alt="Mic" />
                </button>
                <button
                  type="button"
                  className="send-btn"
                  aria-label="Send prompt"
                  onClick={() => handleSend()}
                >
                  <img src={assets.send} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Main;
