export default async function handler(req, res) {
  try {
    const id = process.env.NOTION_DATABASE_ID;

    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2026-03-11",
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
