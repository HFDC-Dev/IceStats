import express from "express"
import axios from "axios"

const router = express.Router()

// 🏒 Meilleurs buteurs NHL
router.get("/top-scorers", async (req, res) => {
    try {
        const { data } = await axios.get(
            "https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=goals&limit=10"
        )

        const scorers = data.goals.map(player => ({
            id: player.playerId,
            name: `${player.firstName.default} ${player.lastName.default}`,
            team: player.teamAbbrev,
            goals: player.value,
            gamesPlayed: player.gamesPlayed,
            headshot: player.headshot, // photo joueur
        }))

        res.json(scorers)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Erreur récupération meilleurs buteurs NHL",
        })
    }
})

export default router
