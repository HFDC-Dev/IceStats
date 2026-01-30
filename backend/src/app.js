import express from "express"
import cors from "cors"
import gamesRoutes from "./routes/games.routes.js"
import statsRoutes from "./routes/stats.routes.js"

const app = express()

// Autoriser les requêtes depuis le frontend (Vite)
app.use(
    cors({
        origin: "http://localhost:5173"
    })
)

// Parser le JSON
app.use(express.json())

app.use("/api/games", gamesRoutes)
app.use("/api/stats", statsRoutes)


export default app