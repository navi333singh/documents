import OpenAI from "openai";
const openai = new OpenAI({ apiKey: 'sk-proj-tsqmrnCEdMXMbxu4SC68T3BlbkFJH6blKXYOLbt6WOGlzRCr' });

export const getTextFromImage = async (image, type) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "retrive a only json array with the following params: card_number, municipality, nome, cognome, place_of_birth, date_of_birth, sex, height, nationality, issuing_date, expiry_date, right_bottom_code" },
                    {
                        type: "image_url",
                        image_url: {
                            "url": `data:${type};base64,${image}`,
                        },
                    },
                ],
            },
        ],
        "max_tokens": 300
    });
    const json = response.choices[0]["message"].content;
    var resp = json.replaceAll('`', '');
    resp = resp.replaceAll('json', '');
    const jsonObject = JSON.parse(resp);
    return jsonObject[0];
}
