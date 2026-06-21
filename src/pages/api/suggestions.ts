import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q;

  try {
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}`
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch {
    res.status(500).json([]);
  }
}