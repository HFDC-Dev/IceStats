import express from "express"
import axios from "axios"

const router = express.Router()

// ─── Données statiques des équipes NHL par conférence ─────────────────────────

const TEAMS = {
    Est: {
        "Atlantique": [
            { abbrev: "BOS", name: "Boston Bruins" },
            { abbrev: "BUF", name: "Buffalo Sabres" },
            { abbrev: "DET", name: "Detroit Red Wings" },
            { abbrev: "FLA", name: "Florida Panthers" },
            { abbrev: "MTL", name: "Montréal Canadiens" },
            { abbrev: "OTT", name: "Ottawa Senators" },
            { abbrev: "TBL", name: "Tampa Bay Lightning" },
            { abbrev: "TOR", name: "Toronto Maple Leafs" },
        ],
        "Métropolitaine": [
            { abbrev: "CAR", name: "Carolina Hurricanes" },
            { abbrev: "CBJ", name: "Columbus Blue Jackets" },
            { abbrev: "NJD", name: "New Jersey Devils" },
            { abbrev: "NYI", name: "New York Islanders" },
            { abbrev: "NYR", name: "New York Rangers" },
            { abbrev: "PHI", name: "Philadelphia Flyers" },
            { abbrev: "PIT", name: "Pittsburgh Penguins" },
            { abbrev: "WSH", name: "Washington Capitals" },
        ],
    },
    Ouest: {
        "Centrale": [
            { abbrev: "ARI", name: "Utah Hockey Club" },
            { abbrev: "CHI", name: "Chicago Blackhawks" },
            { abbrev: "COL", name: "Colorado Avalanche" },
            { abbrev: "DAL", name: "Dallas Stars" },
            { abbrev: "MIN", name: "Minnesota Wild" },
            { abbrev: "NSH", name: "Nashville Predators" },
            { abbrev: "STL", name: "St. Louis Blues" },
            { abbrev: "WPG", name: "Winnipeg Jets" },
        ],
        "Pacifique": [
            { abbrev: "ANA", name: "Anaheim Ducks" },
            { abbrev: "CGY", name: "Calgary Flames" },
            { abbrev: "EDM", name: "Edmonton Oilers" },
            { abbrev: "LAK", name: "Los Angeles Kings" },
            { abbrev: "SJS", name: "San Jose Sharks" },
            { abbrev: "SEA", name: "Seattle Kraken" },
            { abbrev: "UTA", name: "Utah Hockey Club" },
            { abbrev: "VAN", name: "Vancouver Canucks" },
            { abbrev: "VGK", name: "Vegas Golden Knights" },
        ],
    },
}

// ─── GET /api/teams ────

router.get("/", (req, res) => {
    res.json(TEAMS)
})

// ─── GET /api/teams/:abbrev/lineup ───
// Retourne la composition probable de l'équipe

router.get("/:abbrev/lineup", async (req, res) => {
    const { abbrev } = req.params

    try {
        const { data } = await axios.get(
            `https://api-web.nhle.com/v1/roster/${abbrev}/current`
        )

        const formatPlayer = (p) => ({
            id: p.id,
            firstName: p.firstName?.default ?? "",
            lastName: p.lastName?.default ?? "",
            number: p.sweaterNumber ?? null,
            position: p.positionCode ?? null,
            headshot: p.headshot ?? null,
            nationality: p.birthCountry ?? null,
        })

        res.json({
            forwards: (data.forwards ?? []).map(formatPlayer),
            defensemen: (data.defensemen ?? []).map(formatPlayer),
            goalies: (data.goalies ?? []).map(formatPlayer),
        })
    } catch (error) {
        console.error("Lineup error:", error.message)
        res.status(500).json({ error: "Erreur récupération composition" })
    }
})

export default router