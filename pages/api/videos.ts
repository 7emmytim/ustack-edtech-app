// pages/api/videos.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(
                q
            )}&key=${process.env.YOUTUBE_API_KEY}`
        );

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Return only the first video
        res.status(200).json(data.items[0] ?? null);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
