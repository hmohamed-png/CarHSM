function FloatingAIButton() {
  try {
    const [isVisible, setIsVisible] = React.useState(true);

    return isVisible ? (
      <a href="ai-assistant.html" className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-3xl transition-all duration-300 z-50 group animate-pulse">
        <div className="icon-bot text-2xl text-white"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">AI</div>
        <div className="absolute right-20 bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <p className="text-sm font-semibold">Ask AI Assistant</p>
        </div>
      </a>
    ) : null;
  } catch (error) {
    console.error('FloatingAIButton error:', error);
    return null;
  }
}