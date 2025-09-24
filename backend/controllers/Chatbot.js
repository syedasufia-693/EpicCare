import axios from 'axios';
export const Chatbot = async (req, res) => {
    // ?key = ${ apiKey } "
    try {
        const data = await req.body.text;
        console.log(data);
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `In medical field ${data}`
                        },
                    ],
                },
            ],
        };
        console.log(requestBody);

        const response = await axios.post(process.env.apiUrl, requestBody);
        console.log(response.data);
        res.json(response.data);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

}