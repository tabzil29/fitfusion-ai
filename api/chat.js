import axios from "axios";

// Get IBM IAM Token
async function getAccessToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
    params.append("apikey", process.env.IBM_API_KEY);

    const response = await axios.post(
        "https://iam.cloud.ibm.com/identity/token",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data.access_token;
}

export default async function handler(req, res) {
    // Enable CORS for localhost testing
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const token = await getAccessToken();

        const profile = req.body.profile || {};
        const profileContext = `[User Profile]
Name: ${profile.name || "N/A"}
Age: ${profile.age || "N/A"}
Gender: ${profile.gender || "N/A"}
Height: ${profile.height || "N/A"} cm
Weight: ${profile.weight || "N/A"} kg
Goal: ${profile.goal || "N/A"}
Diet: ${profile.diet || "N/A"}
(Do NOT ask for any of the above details again — they are already provided.)

[User Question]
${req.body.message}`;

        const response = await axios.post(
            `${process.env.INSTANCE_URL}/v1/orchestrate/${process.env.AGENT_ID}/chat/completions`,
            {
                messages: [
                    {
                        role: "user",
                        content: profileContext
                    }
                ],
                stream: false
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            reply: response.data.choices[0].message.content,
            thread_id: response.data.thread_id
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        return res.status(500).json(
            err.response?.data || { error: err.message }
        );
    }
}
