#pip install google-genai

import streamlit as st, os
import google.generativeai as genai
import json

def setup_page():
    st.set_page_config(
        page_title="⚡ FinBud Assistant",
        layout="centered"
    )
    
    # Create a header with a reset button
    col1, col2 = st.columns([4, 1])
    with col1:
        st.header("FINBUD ASSISTANT")
    with col2:
        if st.button("New Chat", type="primary"):
            # Clear session state and force rerun
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
    
    hide_menu_style = """
            <style>
            #MainMenu {visibility: hidden;}
            </style>
            """
    st.markdown(hide_menu_style, unsafe_allow_html=True)

def get_stock_platform_context():
    """Provides context about the stock trading platform features for the chatbot."""
    return """
    You are a financial advisor chatbot specialized in the FinBud platform. Use this context to help users:
    
    STOCK CHART FEATURES:
    - Real-time stock data for open markets displayed as candlestick charts
    - Historical data available for closed markets (7, 10, 20, or 30 days)
    - OHLC data (Open, High, Low, Close) for each candlestick
    - Price and percentage change calculations from previous close
    - Color-coded indicators (Green for price up, Red for price down)
    - Market status indicator (Open/Closed)
    - Live time display
    
    DATA POINTS AVAILABLE:
    - Latest stock value
    - Previous close value
    - Price change (with + or - sign)
    - Percentage change (with + or - sign)
    - Historical trends visible in charts
    
    USER INTERACTIONS:
    - Users can select different time ranges for historical data
    - Hovering over candlesticks shows specific OHLC data for that time point
    - Real-time updates through websocket connections when market is open
    
    TECHNICAL IMPLEMENTATION:
    - Built with Next.js and TypeScript
    - Uses lightweight-charts library for candlestick charts
    - Real-time data via socket.io connections
    - Redux for state management
    - Material UI components for responsive design
    - Dynamic routing based on market and symbol parameters
      URL structure: /chart/[market]/[symbol]
      Example: /chart/NSE/RELIANCE for Reliance Industries on National Stock Exchange
    
    When answering questions about stocks and trading, incorporate this knowledge about the platform's capabilities.
    """

def get_current_stock_context():
    """Gets context about the current stock being viewed based on URL parameters."""
    # In a production app, this would detect the actual URL parameters
    # For demo purposes, let's add a stock selector
    st.subheader("Stock Context")
    col1, col2 = st.columns(2)
    
    with col1:
        markets = ["NSE", "BSE", "NYSE", "NASDAQ"]
        market = st.selectbox("Select Market", markets)
    
    with col2:
        symbols = {
            "NSE": ["RELIANCE", "TCS", "INFY", "HDFCBANK", "BAJFINANCE"],
            "BSE": ["RELIANCE", "TCS", "INFY", "HDFCBANK", "BAJFINANCE"],
            "NYSE": ["AAPL", "MSFT", "GOOGL", "AMZN", "META"],
            "NASDAQ": ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
        }
        symbol = st.selectbox("Select Symbol", symbols[market])
    
    # Store the current stock context in session state
    if 'current_stock' not in st.session_state or st.session_state.current_stock != f"{market}:{symbol}":
        st.session_state.current_stock = f"{market}:{symbol}"
        if 'messages' in st.session_state:
            # Add a system message about the stock change
            st.session_state.messages.append({
                "role": "system", 
                "content": f"The user is now viewing stock chart for {symbol} on {market}.",
                "visible": False  # Flag to not display system messages to the user
            })
    
    return {
        "market": market,
        "symbol": symbol,
        "url": f"/chart/{market}/{symbol}"
    }
       
def main():
    # Get current stock context (simulates Next.js dynamic routing)
    current_stock = get_current_stock_context()
    
    # Initialize messages in session state
    if 'messages' not in st.session_state:
        st.session_state.messages = []
        # Add initial system message about the current stock
        st.session_state.messages.append({
            "role": "system", 
            "content": f"The user is viewing stock chart for {current_stock['symbol']} on {current_stock['market']}.",
            "visible": False
        })
    
    # Display chat messages (excluding system messages)
    for message in st.session_state.messages:
        if message.get("visible", True):  # Only show messages marked as visible
            with st.chat_message(message["role"], avatar="👤" if message["role"] == "user" else "📈"):
                st.markdown(message["content"])
    
    # Get user input
    prompt = st.chat_input(f"Ask about {current_stock['symbol']} on {current_stock['market']}")
    
    if prompt:
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user", avatar="👤"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant", avatar="📈"):
            with st.spinner("Thinking..."):
                # Create chat instance and add system message with context
                chat = model.start_chat(history=[])
                
                # Add the platform context
                platform_context = get_stock_platform_context()
                chat.send_message(f"SYSTEM: {platform_context}")
                
                # Add current stock context
                stock_context = f"""
                CURRENT STOCK CONTEXT:
                The user is currently viewing the chart for {current_stock['symbol']} on {current_stock['market']} exchange.
                The URL path is {current_stock['url']}.
                When the user asks questions, assume they're referring to this stock unless they specifically mention another stock.
                """
                chat.send_message(f"SYSTEM: {stock_context}")
                
                # Construct conversation history for the model
                conversation = []
                for msg in st.session_state.messages:
                    if msg["role"] == "system":
                        # Add system messages directly
                        conversation.append(f"SYSTEM: {msg['content']}")
                    elif msg["role"] == "user":
                        # Add user messages
                        conversation.append(f"USER: {msg['content']}")
                    elif msg["role"] == "assistant":
                        # Add assistant messages
                        conversation.append(f"ASSISTANT: {msg['content']}")
                
                # Join conversation and get response
                full_prompt = "\n".join(conversation)
                response = chat.send_message(full_prompt)
                
                # Display response
                st.markdown(response.text)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response.text})
                
if __name__ == '__main__':
    setup_page()
    genai.configure(api_key=os.environ.get('GOOGLE_API_KEY', 'AIzaSyB7--IrFMO0pnyYmFls4z5c6gKHRDRwdm8'))
    MODEL_ID = "gemini-1.5-flash"
    model = genai.GenerativeModel(MODEL_ID)
    main()