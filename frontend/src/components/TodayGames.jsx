import GameCard from "./GameCard"

const games = [
    {
        id: 1,
        home: { name: "Canadiens", abbrev: "MTL" },
        away: { name: "Bruins", abbrev: "BOS" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "20:00"
    },
    {
        id: 2,
        home: { name: "Rangers", abbrev: "NYR" },
        away: { name: "Penguins", abbrev: "PIT" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "01:15"
    },
    {
        id: 3,
        home: { name: "Rangers", abbrev: "NYR" },
        away: { name: "Penguins", abbrev: "PIT" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "01:15"
    },
    {
        id: 4,
        home: { name: "Oilers", abbrev: "EDM" },
        away: { name: "Jets", abbrev: "WPG" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "02:30"
    },
    {
        id: 5,
        home: { name: "Wild", abbrev: "MIN" },
        away: { name: "Kraken", abbrev: "SEA" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "04:30"
    },
    {
        id: 6,
        home: { name: "Capitals", abbrev: "WSH" },
        away: { name: "Flyers", abbrev: "PHI" },
        homeScore: null,
        awayScore: null,
        status: "À venir",
        time: "04:30"
    }
]

const TodayGames = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}

export default TodayGames
