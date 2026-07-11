import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Get IBM IAM Token
async function getAccessToken() {
    const params = new URLSearchParams();
    params.append(
        "grant_type",
        "urn:ibm:params:oauth:grant-type:apikey"
    );
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

app.post("/chat", async (req, res) => {
    console.log(req.body);
    console.log("🔥 /chat endpoint hit");
console.log(req.body);
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

res.json({
    reply: response.data.choices[0].message.content,
    thread_id: response.data.thread_id
});    } catch (err) {

        console.log(
            err.response?.data || err.message
        );

        res.status(500).json(
            err.response?.data || { error: err.message }
        );
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});