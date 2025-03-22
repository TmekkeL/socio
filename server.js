const express = require('express');
const cors = require('cors');  // Enable CORS for frontend communication

const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from frontend

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
