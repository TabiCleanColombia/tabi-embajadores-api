export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://tabiclean.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido"
    });
  }

  try {
    const { nombre, whatsapp, ciudad } = req.body || {};

    if (!nombre || !whatsapp || !ciudad) {
      return res.status(400).json({
        ok: false,
        error: "Faltan nombre, whatsapp o ciudad"
      });
    }

    const notionResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2026-03-11"
      },
      body: JSON.stringify({
        parent: {
          data_source_id: process.env.NOTION_DATABASE_ID
        },
        properties: {
          "Nombre": {
            title: [
              {
                text: {
                  content: nombre
                }
              }
            ]
          },
          "Estado": {
            status: {
              name: "Por contactar"
            }
          },
          "Ciudad/Pais": {
            multi_select: [
              {
                name: normalizarCiudad(ciudad)
              }
            ]
          },
          "Teléfono": {
            phone_number: whatsapp
          },
          "Origen de lead": {
            multi_select: [
              {
                name: "Pagina Web - form"
              }
            ]
          },
          "Tipo": {
            multi_select: [
              {
                name: "Embajador Tabi (Persona)"
              }
            ]
          }
        }
      })
    });

    const notionData = await notionResponse.json();

    if (!notionResponse.ok) {
      return res.status(notionResponse.status).json({
        ok: false,
        error: notionData
      });
    }

    return res.status(200).json({
      ok: true,
      notion_page_id: notionData.id
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

function normalizarCiudad(ciudad) {
  const value = String(ciudad || "").trim().toLowerCase();

  const map = {
    "bogota": "Bogotá",
    "bogotá": "Bogotá",
    "bogota dc": "Bogotá",
    "bogotá dc": "Bogotá",
    "bogota d.c.": "Bogotá",
    "bogotá d.c.": "Bogotá",
    "medellin": "Medellín",
    "medellín": "Medellín",
    "cali": "Cali",
    "barranquilla": "Barranquilla",
    "cartagena": "Cartagena",
    "bucaramanga": "Bucaramanga",
    "manizales": "Manizales",
    "ibague": "Ibagué",
    "ibagué": "Ibagué",
    "villavicencio": "Villavicencio",
    "monteria": "Monteria",
    "pasto": "Pasto",
    "popayan": "Popayan",
    "popayán": "Popayan",
    "palmira": "Palmira",
    "sincelejo": "Sincelejo",
    "valledupar": "Valledupar",
    "mosquera": "Mosquera",
    "funza": "Funza",
    "cajica": "Cajica",
    "cajicá": "Cajica"
  };

  return map[value] || ciudad;
}
