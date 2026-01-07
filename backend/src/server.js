import dotenv from "dotenv"
import app from "./app.js"

// Charger les variables d'environnement
dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Backend lancé sur http://localhost:${PORT}`)
})