
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import Modal from '../common/Modal.tsx';
import { createChat } from '../../utils/gemini.ts';
import { renderMarkdown } from '../../utils/markdown.ts';

interface AiAssistantModalProps {
    closeModal: () => void;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ closeModal }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatInstance = createChat();
        if (chatInstance) {
            setChat(chatInstance);
            setIsAvailable(true);
            setHistory([{ role: 'model', text: 'سلام! من "هوش‌یار"، دستیار هوش مصنوعی شما هستم. چطور می‌توانم در مدیریت فروش به شما کمک کنم؟' }]);
        } else {
            setIsAvailable(false);
            setHistory([{ role: 'model', text: 'دستیار هوش مصنوعی در حال حاضر در دسترس نیست. لطفاً از تنظیم صحیح کلید API در محیط برنامه اطمینان حاصل کنید.' }]);
        }
    }, []);

    useEffect(() => {
        // Auto-scroll to the bottom of the chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !isAvailable || !chat) return;

        const text = userInput;
        setUserInput('');
        setIsLoading(true);
        setHistory(prev => [...prev, { role: 'user', text }]);
        
        // Add a placeholder for the model's response
        setHistory(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const response = await chat.sendMessageStream({ message: text });
            let fullResponse = '';
            for await (const chunk of response) {
                fullResponse += chunk.text;
                // Update the last message (the placeholder) in the history
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', text: fullResponse };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', text: 'متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.' };
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={closeModal} size="2xl">
            <div className="flex flex-col max-h-[80vh]">
                <div className="flex items-center gap-3 border-b pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.903a.75.75 0 00-1.292-.784l-1.25 2.165a.75.75 0 00.22 1.045l2.165 1.25a.75.75 0 001.045-.22l2.165-3.75a.75.75 0 00-.784-1.292L11.983 1.903zM8.017 18.097a.75.75 0 001.292.784l1.25-2.165a.75.75 0 00-.22-1.045l-2.165-1.25a.75.75 0 00-1.045.22l-2.165 3.75a.75.75 0 00.784 1.292l3.269-1.897z" /><path fillRule="evenodd" d="M12.243 9.243a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L15.939 14H8.75a.75.75 0 010-1.5h7.19l-3.7-3.7a.75.75 0 010-1.061zM4.06 4.06a.75.75 0 011.06 0l3.7 3.7H1.75a.75.75 0 110-1.5h7.06L5.12 2.56a.75.75 0 010-1.06l-.53-.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                         <h3 className="text-xl font-bold">دستیار هوش مصنوعی (هوش‌یار)</h3>
                         <p className="text-sm text-secondary">طراحی شده با Gemini</p>
                    </div>
                </div>
                
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 space-y-4">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full flex-shrink-0 bg-purple-100 text-purple-600 flex items-center justify-center text-sm">ه</div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`} style={{backgroundColor: msg.role === 'user' ? 'var(--button-bg)' : 'var(--bg-color)', color: msg.role === 'user' ? 'white' : 'var(--text-color)'}}>
                                 <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: msg.text === '' ? '<div class="animate-pulse">...</div>' : renderMarkdown(msg.text) }}></div>
                            </div>
                            {msg.role === 'user' && <div className="w-8 h-8 rounded-full flex-shrink-0 bg-blue-100 text-blue-600 flex items-center justify-center text-sm">ش</div>}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isAvailable ? "پیام خود را بنویسید..." : "دستیار AI در دسترس نیست"}
                            className="flex-1 p-2 border rounded-lg bg-gray-50 text-gray-700 disabled:opacity-50"
                            disabled={isLoading || !isAvailable}
                        />
                        <button onClick={handleSendMessage} className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50" disabled={isLoading || !isAvailable}>
                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'ارسال'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AiAssistantModal;
