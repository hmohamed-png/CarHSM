import { useEffect, useRef, useState } from 'react';
import { invokeAIAgent } from '../utils/apiClient.js';

const suggestions = [
  'When should I change my oil?',
  'How often should I rotate tires?',
  'What are signs of brake problems?',
  'Tell me about battery maintenance'
];

export default function AIAssistant() {
  try {
    const [messages, setMessages] = useState([
      {
        role: 'ai',
        content:
          "Hello! I'm your UCarX AI assistant. I can help you with vehicle maintenance advice, service recommendations, and answer questions about your car. How can I assist you today?"
      }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
      if (!input.trim()) return;

      const userMessage = input.trim();
      setInput('');
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
      setLoading(true);

      try {
        const chatHistory = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
        const systemPrompt = `You are a helpful car maintenance expert assistant for UCarX app. Provide practical advice about vehicle maintenance, service schedules, troubleshooting, and general automotive questions. Be concise and helpful.\n\nChat History:\n${chatHistory}`;

        const response = await invokeAIAgent(systemPrompt, userMessage);
        setMessages((prev) => [...prev, { role: 'ai', content: response }]);
      } catch (error) {
        console.error('AI error:', error);
        setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-gray-600">Ask me anything about car maintenance and vehicle care</p>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

            {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
            )}

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <div className="icon-send text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AIAssistant error:', error);
    return null;
  }
}
