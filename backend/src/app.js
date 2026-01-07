import express from "express"
import cors from "cors"

const app = express()

// Autoriser les requêtes depuis le frontend (Vite)
app.use(
    cors({
        origin: "http://localhost:5173"
    })
)

// Parser le JSON
app.use(express.json())

export default app