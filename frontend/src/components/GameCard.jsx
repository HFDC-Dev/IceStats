const getLogoUrl = (abbrev) =>
    `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`

const formatFrenchTime = (utcDate) => {
    return new Date(utcDate).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
    })
}

const statusLabel = {
    LIVE: "En cours",
    FINAL: "Terminé",
    FUT: "À venir",
    PRE: "À venir",
}

const GameCard = ({ game }) => {
    return (
        <div className="rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1">

            {/* Équipes + Score */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 text-base sm:text-lg gap-4 sm:gap-0">

                {/* Équipe à gauche */}
                <div className="flex flex-col items-center sm:items-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center rounded mb-1">
                        <img
                            src={getLogoUrl(game.away.abbrev)}
                            alt={game.away.name}
                            className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
                        />
                    </div>
                    <span className="font-semibold text-center sm:text-left truncate max-w-[100px] sm:max-w-full">
                        {game.away.name}
                    </span>
                </div>

                {/* Score */}
                <div className="text-2xl sm:text-3xl font-bold mx-0 sm:mx-4">
                    {game.awayScore ?? "-"} - {game.homeScore ?? "-"}
                </div>

                {/* Équipe à droite */}
                <div className="flex flex-col items-center sm:items-end">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center rounded mb-1">
                        <img
                            src={getLogoUrl(game.home.abbrev)}
                            alt={game.home.name}
                            className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
                        />
                    </div>
                    <span className="font-semibold text-center sm:text-right truncate max-w-[100px] sm:max-w-full">
                        {game.home.name}
                    </span>
                </div>
            </div>

            {/* Statut + heure */}
            <div className="text-center text-xs sm:text-sm">
                <span
                    className={`px-3 py-1 rounded-full font-medium
            ${game.status === "LIVE"
                            ? "bg-green-600/20 text-green-400 animate-pulse"
                            : game.status === "FINAL"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
                        }
          `}
                >
                    {statusLabel[game.status] ?? game.status} •{" "}
                    {formatFrenchTime(game.startTimeUTC)}
                </span>
            </div>
        </div>
    )
}


export default GameCard