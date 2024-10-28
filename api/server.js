// api/server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// 모든 도메인 허용 CORS 설정
app.use(cors());
app.options('*', cors());

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
        res.setHeader("Access-Control-Allow-Origin", "*"); // 모든 도메인 허용
        res.json(data);
    } catch (error) {
        console.error("API 요청 오류:", error);
        res.status(500).json({ error: "API 요청에 실패했습니다." });
    }
});

module.exports = app;
