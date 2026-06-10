import express from "express"
import axios from "axios"

const router = express.Router()

const formatPlayers = (data, category) =>
    data[category].map(player => ({
        id: player.playerId,
        name: `${player.firstName.default} ${player.lastName.default}`,
        team: player.teamAbbrev,
        value: player.value,
        headshot: player.headshot,
    }))

// ── Meilleurs buteurs ──
router.get("/top-scorers", async (req, res) => {
    try {
        const { data } = await axios.get(
            "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=goals&limit=10"
        )
        res.json(formatPlayers(data, "goals"))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur récupération meilleurs buteurs" })
    }
})

// ── Meilleurs passeurs ──
router.get("/top-assisters", async (req, res) => {
    try {
        const { data } = await axios.get(
            "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=assists&limit=10"
        )
        res.json(formatPlayers(data, "assists"))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur récupération meilleurs passeurs" })
    }
})

export default router