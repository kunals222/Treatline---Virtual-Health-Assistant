import React, { useState, useEffect } from 'react';
import '../styles/chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            // Load the main Botpress script
            const mainScript = document.createElement('script');
            mainScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
            mainScript.async = true;
            document.body.appendChild(mainScript);

            mainScript.onload = () => {
                // Load the custom bot configuration script
                const configScript = document.createElement('script');
                configScript.src = 'https://files.bpcontent.cloud/2025/02/08/16/20250208165131-LUYFBS5R.js';
                configScript.async = true;
                document.body.appendChild(configScript);

                configScript.onload = () => {
                    // Wait for Botpress to be fully loaded
                    const checkBotpress = setInterval(() => {
                        if (window.botpressWebChat) {
                            window.botpressWebChat.init({
                                hideWidget: true,
                                disableAnimations: true,
                                showWidget: false,
                                hideConversationButton: true,
                                disableNotificationSound: true,
                                enableReset: false,
                                showPoweredBy: false,
                                chatId: 'treatline-bot',
                                useSessionStorage: true,
                                className: 'custom-bot',
                                hideWidgetOnLoad: true,
                                containerWidth: '400px',
                                layoutWidth: '400px',
                                stylesheet: 'body .bp-widget-widget { display: none !important; }',
                                extraStylesheet: '.bp-widget-web button.bp-widget-btn { display: none !important; }'
                            });
                            clearInterval(checkBotpress);
                            setIsInitialized(true);
                        }
                    }, 100);
                };
            };
        }
    }, [isInitialized]);

    const toggleChat = () => {
        if (!window.botpressWebChat) return;
        
        if (isOpen) {
            window.botpressWebChat.sendEvent({ type: 'hide' });
        } else {
            window.botpressWebChat.sendEvent({ type: 'show' });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
            <button 
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <span className="close-icon">✕</span>
                ) : (
                    <span className="chat-icon">💬</span>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
