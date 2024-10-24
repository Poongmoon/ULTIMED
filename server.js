const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Vercel에서는 자동으로 환경 변수를 로드하므로 dotenv는 로컬에서만 사용
dotenv.config();

const app = express();
app.use(express.json());

// Vercel에서 환경 변수로 설정된 OPENAI_API_KEY 사용
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/gpt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`, // 환경 변수 사용
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        res.json({ answer: data.choices[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'GPT 요청 실패' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
