export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=municipio&$limit=5000"
    );

    const data = await response.json();

    const ciudades = [...new Set(
      data
        .map(item => item.municipio)
        .filter(Boolean)
        .map(city => city.trim())
    )].sort((a, b) => a.localeCompare(b, "es"));

    const js = `window.TC_CIUDADES_COLOMBIA = ${JSON.stringify(ciudades, null, 2)};`;

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    return res.status(200).send(js);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
