const getNhlLogo = (abbrev) =>
    `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`

// const getInternationalFlag = (abbrev) => {
//     const code = countryCodeMap[abbrev]
//     if (!code) return null
//     return `https://flagcdn.com/w80/${code}.png`
// }

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
    FUT: "À venir",
    PRE: "À venir",
}

// const countryCodeMap = {
//     CAN: "ca",
//     USA: "us",
//     SWE: "se",
//     FIN: "fi",
//     GER: "de",
//     CZE: "cz",
//     SVK: "sk",
//     SUI: "ch",
//     LAT: "lv",
//     DEN: "dk",
//     NOR: "no",
//     ITA: "it",
//     FRA: "fr",
// }

const GameCard = ({ game }) => {
    // Détection match international
    // const isInternational = game.gameType !== "02"

    // const getLogo = (team) => {
    //     if (isInternational) {
    //         return getInternationalFlag(team.abbrev)
    //     }
    //     return getNhlLogo(team.abbrev)
    // }

    const getLogo = (team) => {
        return getNhlLogo(team.abbrev)
    }

    return (
        <div className="relative rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1">

            {/* 🥇 Badge JO centré */}
            {/* {isInternational && (
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-400 text-black text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
                        🥇 Jeux Olympiques 2026
                    </div>
                </div>
            )} */}


            {/* Équipes + Score */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 text-base sm:text-lg gap-4 sm:gap-0">

                {/* Équipe extérieure */}
                <div className="flex flex-col items-center sm:items-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center rounded mb-1">
                        <img
                            src={getLogo(game.away)}
                            alt={game.away.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            onError={(e) => {
                                e.target.src = getNhlLogo(game.away.abbrev)
                            }}
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

                {/* Équipe domicile */}
                <div className="flex flex-col items-center sm:items-end">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center rounded mb-1">
                        <img
                            src={getLogo(game.home)}
                            alt={game.home.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            onError={(e) => {
                                e.target.src = getNhlLogo(game.home.abbrev)
                            }}
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
                        }`}
                >
                    {statusLabel[game.status] ?? game.status} •{" "}
                    {formatFrenchDateTime(game.startTimeUTC)}
                </span>
            </div>
        </div>
    )
}

export default GameCard
