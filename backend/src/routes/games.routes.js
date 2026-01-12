import express from "express"
import axios from "axios"

const router = express.Router()

router.get("/today", async (req, res) => {
    try {
        const { data } = await axios.get(
            "https://api-web.nhle.com/v1/schedule/now"
        )

        const todayDate = new Date()
        const tomorrowDate = new Date()
        tomorrowDate.setDate(todayDate.getDate() + 1)

        const today = todayDate.toISOString().split("T")[0]
        const tomorrow = tomorrowDate.toISOString().split("T")[0]

        const todayGames = []
        const tomorrowGames = []

        data.gameWeek.forEach(day => {
            day.games.forEach(game => {
                if (game.startTimeUTC.startsWith(today)) {
                    todayGames.push(formatGame(game))
                } else if (game.startTimeUTC.startsWith(tomorrow)) {
                    tomorrowGames.push(formatGame(game))
                }
            })
        })

        res.json({
            today: todayGames,
            tomorrow: tomorrowGames
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur récupération matchs NHL" })
    }
})

const formatGame = (game) => ({
    id: game.id,
    status: game.gameState,
    startTimeUTC: game.startTimeUTC,
    home: {
        name: game.homeTeam.commonName.default,
        abbrev: game.homeTeam.abbrev
    },
    away: {
        name: game.awayTeam.commonName.default,
        abbrev: game.awayTeam.abbrev
    },
    homeScore: game.homeTeam.score ?? null,
    awayScore: game.awayTeam.score ?? null
})

export default router
