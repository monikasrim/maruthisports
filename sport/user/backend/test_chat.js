const axios = require('axios');

const testChat = async () => {
    console.log('--- Testing AI Chatbot API ---');

    const queries = [
        "Show me some cricket bats",
        "Where is my order?",
        "Who are you?",
        "Find some shoes"
    ];

    for (const q of queries) {
        try {
            console.log(`\nUser: ${q}`);
            const { data } = await axios.post('http://localhost:5000/api/chat', { message: q });
            console.log(`Bot: ${data.message}`);
            if (data.data) {
                console.log(`Data Attached: ${Object.keys(data.data).join(', ')}`);
                if (data.data.products) console.log(`Products Found: ${data.data.products.length}`);
                if (data.data.orders) console.log(`Orders Found: ${data.data.orders.length}`);
            }
        } catch (err) {
            console.error(`Error for query "${q}":`, err.response?.data || err.message);
        }
    }
};

testChat();
