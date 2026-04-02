import express from "express"
import axios from "axios"

const router = express.Router()

const formatGame = (game) => ({
    id: game.id,
    status: game.gameState,
    startTimeUTC: game.startTimeUTC,
    home: {
        name: game.homeTeam.commonName?.default ?? game.homeTeam.abbrev,
        abbrev: game.homeTeam.abbrev,
    },
    away: {
        name: game.awayTeam.commonName?.default ?? game.awayTeam.abbrev,
        abbrev: game.awayTeam.abbrev,
    },
    homeScore: game.homeTeam.score ?? null,
    awayScore: game.awayTeam.score ?? null,
})

router.get("/today", async (req, res) => {
    try {
        const { data } = await axios.get("https://api-web.nhle.com/v1/schedule/now")


        const nowEST = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))

        const pad = (n) => String(n).padStart(2, "0")
        const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

        const todayStr = toDateStr(nowEST)
        const yesterdayEST = new Date(nowEST); yesterdayEST.setDate(nowEST.getDate() - 1)
        const tomorrowEST = new Date(nowEST); tomorrowEST.setDate(nowEST.getDate() + 1)
        const yesterdayStr = toDateStr(yesterdayEST)
        const tomorrowStr = toDateStr(tomorrowEST)

        const yesterdayGames = []
        const todayGames = []
        const tomorrowGames = []
        const upcomingGames = []

        data.gameWeek.forEach(day => {

            const dayDate = day.date ?? null

            day.games.forEach(game => {
                const formatted = formatGame(game)
                const isLive = game.gameState === "LIVE"

                const gameDate = dayDate ?? game.startTimeUTC.split("T")[0]

                if (isLive) {
                    todayGames.push(formatted)
                } else if (gameDate === yesterdayStr) {
                    yesterdayGames.push(formatted)
                } else if (gameDate === todayStr) {
                    todayGames.push(formatted)
                } else if (gameDate === tomorrowStr) {
                    tomorrowGames.push(formatted)
                }

                if (new Date(game.startTimeUTC) > new Date()) {
                    upcomingGames.push(formatted)
                }
            })
        })


        let finalYesterday = yesterdayGames
        if (finalYesterday.length === 0) {
            try {
                const { data: yData } = await axios.get(
                    `https://api-web.nhle.com/v1/schedule/${yesterdayStr}`
                )
                yData.gameWeek?.forEach(day => {
                    day.games.forEach(game => {
                        const gameDate = day.date ?? game.startTimeUTC.split("T")[0]
                        if (gameDate === yesterdayStr) finalYesterday.push(formatGame(game))
                    })
                })
            } catch (_) { /* pas bloquant */ }
        }

        res.json({
            yesterday: finalYesterday,
            today: sortGames(todayGames),
            tomorrow: sortGames(tomorrowGames),
            fallback:
                todayGames.length === 0 && tomorrowGames.length === 0
                    ? upcomingGames.slice(0, 6)
                    : [],
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur récupération matchs NHL" })
    }
})

// Retourne les 5 dernières confrontations directes entre deux équipes

router.get("/h2h", async (req, res) => {
    const { home, away } = req.query

    if (!home || !away) {
        return res.status(400).json({ error: "Paramètres home et away requis" })
    }

    try {
        // On récupère le schedule de la saison en cours des deux équipes
        const [homeRes, awayRes] = await Promise.all([
            axios.get(`https://api-web.nhle.com/v1/club-schedule-season/${home}/now`),
            axios.get(`https://api-web.nhle.com/v1/club-schedule-season/${away}/now`),
        ])

        const homeGames = homeRes.data.games ?? []

        // Matchs déjà joués entre les deux équipes cette saison
        const h2hGames = homeGames
            .filter(g => {
                const isFinished = ["OFF", "FINAL", "OVER"].includes(g.gameState)
                const opponent =
                    g.homeTeam.abbrev === home ? g.awayTeam.abbrev : g.homeTeam.abbrev
                return isFinished && opponent === away
            })
            .slice(-5) // 5 derniers
            .map(g => ({
                date: g.startTimeUTC.split("T")[0],
                homeTeam: g.homeTeam.abbrev,
                awayTeam: g.awayTeam.abbrev,
                homeScore: g.homeTeam.score ?? 0,
                awayScore: g.awayTeam.score ?? 0,
                winner:
                    (g.homeTeam.score ?? 0) > (g.awayTeam.score ?? 0)
                        ? g.homeTeam.abbrev
                        : g.awayTeam.abbrev,
            }))

        // Calcul du bilan (du point de vue de l'équipe "home" du match d'aujourd'hui)
        const wins = h2hGames.filter(g => g.winner === home).length
        const losses = h2hGames.filter(g => g.winner === away).length

        res.json({ games: h2hGames, wins, losses })
    } catch (error) {
        console.error("H2H error:", error.message)
        res.status(500).json({ error: "Erreur récupération H2H" })
    }
})

const sortGames = (games) =>
    [...games].sort((a, b) => {
        if (a.status === "LIVE" && b.status !== "LIVE") return -1
        if (b.status === "LIVE" && a.status !== "LIVE") return 1
        return new Date(a.startTimeUTC) - new Date(b.startTimeUTC)
    })

// Retourne les buts d'un match : buteur, passeurs, période, minute

router.get("/:id/scoring", async (req, res) => {
    const { id } = req.params

    try {
        const { data } = await axios.get(
            `https://api-web.nhle.com/v1/gamecenter/${id}/play-by-play`
        )

        const periodLabel = (p) => {
            if (p === 1) return "1ère période"
            if (p === 2) return "2ème période"
            if (p === 3) return "3ème période"
            if (p === 4) return "Prolongation"
            if (p === 5) return "Tirs au but"
            return `Période ${p}`
        }

        // On filtre uniquement les événements "goal"
        const goals = (data.plays ?? [])
            .filter(play => play.typeDescKey === "goal")
            .map(play => {
                const details = play.details ?? {}
                const scorer = data.rosterSpots?.find(p => p.playerId === details.scoringPlayerId)
                const assist1 = data.rosterSpots?.find(p => p.playerId === details.assist1PlayerId)
                const assist2 = data.rosterSpots?.find(p => p.playerId === details.assist2PlayerId)

                const fullName = (player) =>
                    player
                        ? `${player.firstName?.default ?? ""} ${player.lastName?.default ?? ""}`.trim()
                        : null

                return {
                    period: play.periodDescriptor?.number ?? null,
                    periodLabel: periodLabel(play.periodDescriptor?.number),
                    timeInPeriod: play.timeInPeriod ?? null,   // ex: "14:32"
                    teamAbbrev: details.eventOwnerTeamId === data.homeTeam?.id
                        ? data.homeTeam?.abbrev
                        : data.awayTeam?.abbrev,
                    scorer: fullName(scorer),
                    assist1: fullName(assist1),
                    assist2: fullName(assist2),
                    homeScore: details.homeScore ?? null,
                    awayScore: details.awayScore ?? null,
                    goalType: details.shotType ?? null,        // wrister, slap, etc.
                }
            })

        res.json({ goals })
    } catch (error) {
        console.error("Scoring error:", error.message)
        res.status(500).json({ error: "Erreur récupération des buts" })
    }
})
export default router