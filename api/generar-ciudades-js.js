export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
    );

    const data = await response.json();

    const ciudades = data
      .flatMap(function (departamento) {
        return departamento.ciudades || departamento.municipios || [];
      })
      .filter(Boolean)
      .map(function (city) {
        return String(city).trim();
      })
      .filter(function (city, index, array) {
        return array.indexOf(city) === index;
      })
      .sort(function (a, b) {
        return a.localeCompare(b, "es");
      });

    const js =
      "window.TC_CIUDADES_COLOMBIA = " +
      JSON.stringify(ciudades, null, 2) +
      ";";

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");

    return res.status(200).send(js);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
