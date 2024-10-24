const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const dotenv = require('dotenv');

// 환경 변수 로드 (로컬 개발 시 dotenv 필요)
// Vercel 배포 시 dotenv 불필요, 로컬에서만 필요
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // CORS 허용

// Vercel에서 설정한 환경 변수 API 키 불러오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/gpt', async (req, res) => {
    const { prompt } = req.body;  // 클라이언트에서 보낸 질문 (prompt) 받기

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,  // 환경 변수로 API 키 사용
            },
            body: JSON.stringify({
                model: 'text-davinci-003',  // GPT-3 모델 선택
                prompt: prompt,             // 질문 내용
                max_tokens: 500,            // 응답 길이 설정
            }),
        });

        const data = await response.json();  // 응답 데이터를 JSON으로 파싱
        res.json({ answer: data.choices[0].text });  // 응답을 클라이언트로 전송
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'GPT 요청 실패' });  // 오류 발생 시 처리
    }
});

// 서버 포트 설정 (Vercel 환경에 맞추어 자동 설정되며, 로컬에서는 3000번 포트 사용)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
