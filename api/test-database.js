export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${process.env.NOTION_DATABASE_ID}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2025-09-03"
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
