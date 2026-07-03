export default async function handler(req, res) {
  const response = await fetch("https://tabi-embajadores-api.vercel.app/api/embajadores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: "Prueba Web",
      whatsapp: "3000000000",
      ciudad: "Bogotá"
    })
  });

  const data = await response.json();

  return res.status(response.status).json(data);
}
