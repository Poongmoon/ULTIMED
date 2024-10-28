const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// CORS 설정: 특정 도메인으로 제한하거나 모든 도메인 허용
app.use(cors({ origin: 'https://poongmoon.github.io' })); // 필요한 도메인으로 제한
app.options('*', cors()); // 모든 프리플라이트 요청 허용

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 프리플라이트 OPTIONS 요청에 대한 응답 처리
app.options('/api/gpt', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://poongmoon.github.io');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send();
});

app.post('/api/gpt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        res.setHeader("Access-Control-Allow-Origin", "https://poongmoon.github.io");
        res.json(data);
    } catch (error) {
        console.error("API 요청 오류:", error);
        res.status(500).json({ error: "API 요청에 실패했습니다." });
    }
});

module.exports = app;
