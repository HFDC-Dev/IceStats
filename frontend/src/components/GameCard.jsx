const getLogoUrl = (abbrev) =>
    `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`

const GameCard = ({ game }) => {
    return (
        <div className="rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300">

            {/* Équipes + logos */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <img
                        src={getLogoUrl(game.away.abbrev)}
                        alt={game.away.name}
                        className="w-10 h-10"
                    />
                    <span className="font-semibold">{game.away.name}</span>
                </div>

                <span className="text-sm text-slate-400">VS</span>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">{game.home.name}</span>
                    <img
                        src={getLogoUrl(game.home.abbrev)}
                        alt={game.home.name}
                        className="w-10 h-10"
                    />
                </div>
            </div>

            {/* Scores */}
            <div className="flex justify-between text-xl font-bold mb-2">
                <span>{game.awayScore ?? "-"}</span>
                <span>{game.homeScore ?? "-"}</span>
            </div>

            {/* Statut */}
            <div className="text-center text-sm">
                <span className="">
                    {game.status} • {game.time}
                </span>
            </div>
        </div>
    )
}
export default GameCard
