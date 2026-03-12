const getNhlLogo = (abbrev) =>
    `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`

const formatFrenchDateTime = (utcDate) => {
    const date = new Date(utcDate)
    const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Europe/Paris",
    })
    const formattedTime = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
    })
    return `${formattedDate} • ${formattedTime}`
}

const statusLabel = {
    LIVE: "En cours",
    FINAL: "Terminé",
    OFF: "Terminé",
    OVER: "Terminé",
    FUT: "À venir",
    PRE: "À venir",
}

// ─── H2H Badge

const H2HBadge = ({ h2h, homeAbbrev, awayAbbrev }) => {
    if (!h2h || h2h.games.length === 0) return null

    const { wins, losses, games } = h2h

    return (
        <div className="mt-3 border-t border-white/10 pt-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1.5">
                Confrontations cette saison
            </p>

            {/* Bilan global */}
            <div className="flex justify-center gap-3 mb-2">
                <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                    {homeAbbrev} {wins}V
                </span>
                <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                    {awayAbbrev} {losses}V
                </span>
            </div>

            {/* Historique des matchs */}
            <ul className="space-y-1">
                {games.map((g, i) => {
                    const homeWon = g.winner === homeAbbrev
                    return (
                        <li
                            key={i}
                            className="flex items-center justify-between bg-white/5 rounded px-2 py-1"
                        >
                            <span className="text-slate-500">{g.date}</span>
                            <span className="font-mono font-semibold text-white">
                                {g.homeTeam === homeAbbrev
                                    ? `${g.homeScore} - ${g.awayScore}`
                                    : `${g.awayScore} - ${g.homeScore}`}
                            </span>
                            <span
                                className={`font-bold ${homeWon ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {homeWon ? `✓ ${homeAbbrev}` : `✓ ${awayAbbrev}`}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// GameCard

const GameCard = ({ game, h2h = null }) => {
    const isLive = game.status === "LIVE"
    const isFinal = ["FINAL", "OFF", "OVER"].includes(game.status)
    const isFuture = ["FUT", "PRE"].includes(game.status)

    const statusColor = isLive
        ? "bg-green-600/20 text-green-400 animate-pulse"
        : isFinal
            ? "bg-red-600/20 text-red-400"
            : "bg-blue-600/20 text-blue-400"

    return (
        <div className="relative rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1 bg-white/5 border border-white/10">

            {/* Équipes + Score */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 text-base sm:text-lg gap-4 sm:gap-0">

                {/* Équipe extérieure */}
                <TeamBlock team={game.away} align="left" />

                {/* Score / VS */}
                <div className="text-2xl sm:text-3xl font-bold mx-0 sm:mx-4 text-center min-w-20">
                    {isFuture
                        ? <span className="text-slate-500 text-lg">VS</span>
                        : <>{game.awayScore ?? "-"} – {game.homeScore ?? "-"}</>
                    }
                </div>

                {/* Équipe domicile */}
                <TeamBlock team={game.home} align="right" />
            </div>

            {/* Statut + heure */}
            <div className="text-center text-xs sm:text-sm">
                <span className={`px-3 py-1 rounded-full font-medium ${statusColor}`}>
                    {statusLabel[game.status] ?? game.status} •{" "}
                    {formatFrenchDateTime(game.startTimeUTC)}
                </span>
            </div>

            {/* H2H uniquement pour les matchs non terminés du jour */}
            {!isFinal && h2h && (
                <H2HBadge
                    h2h={h2h}
                    homeAbbrev={game.home.abbrev}
                    awayAbbrev={game.away.abbrev}
                />
            )}
        </div>
    )
}

// TeamBlock 

const TeamBlock = ({ team, align }) => (
    <div className={`flex flex-col items-center ${align === "right" ? "sm:items-end" : "sm:items-start"}`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200/10 flex items-center justify-center rounded mb-1">
            <img
                src={getNhlLogo(team.abbrev)}
                alt={team.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                onError={(e) => { e.target.style.display = "none" }}
            />
        </div>
        <span className="font-semibold text-center truncate max-w-[100px] sm:max-w-full text-sm">
            {team.name}
        </span>
        <span className="text-slate-500 text-xs">{team.abbrev}</span>
    </div>
)

export default GameCard