export default async function handler(req, res) {
  try {
    const url = "https://www.datos.gov.co/resource/xdk5-pm3f.json?$limit=5000";
    const response = await fetch(url);
    const raw = await response.json();

    const rows = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.data)
        ? raw.data
        : [];

    const sample = rows[0] || {};
    const keys = Object.keys(sample);

    const cityKey =
      keys.find(k => k.toLowerCase() === "municipio") ||
      keys.find(k => k.toLowerCase().includes("municipio")) ||
      keys.find(k => k.toLowerCase().includes("nom_mpio")) ||
      keys.find(k => k.toLowerCase().includes("nombre"));

    if (!cityKey) {
      return res.status(500).json({
        ok: false,
        error: "No encontré la columna de municipio",
        sample,
        keys
      });
    }

    const ciudades = [...new Set(
      rows
        .map(item => item[cityKey])
        .filter(Boolean)
        .map(city => String(city).trim())
    )].sort((a, b) => a.localeCompare(b, "es"));

    const js = `window.TC_CIUDADES_COLOMBIA = ${JSON.stringify(ciudades, null, 2)};`;

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    return res.status(200).send(js);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
