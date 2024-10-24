app.post('/api/gpt', async (req, res) => {
    const { prompt } = req.body;

    // 요청 로그를 출력하여 요청이 수신되는지 확인
    console.log('GPT 요청 수신됨:', prompt);

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        console.log('GPT 응답 데이터:', data);  // 응답 데이터도 출력

        res.json({ answer: data.choices[0].text });
    } catch (error) {
        console.error('오류 발생:', error);  // 오류 발생 시 출력
        res.status(500).json({ error: 'GPT 요청 실패' });
    }
});
