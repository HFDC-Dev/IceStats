import { useEffect, useState } from "react"
import axios from "axios"

// ─── StatBlock ───

const StatBlock = ({ title, emoji, endpoint, statLabel }) => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/stats/${endpoint}`)
            .then(({ data }) => setPlayers(data))
            .catch(() => setError("Impossible de charger les données"))
            .finally(() => setLoading(false))
    }, [endpoint])

    return (
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                    {emoji} {title}
                </h2>
            </div>

            {/* Liste déroulante */}
            <div>
                {loading && (
                    <p className="text-slate-400 text-center py-8 animate-pulse text-sm">
                        Chargement…
                    </p>
                )}

                {error && (
                    <p className="text-red-400 text-center py-8 text-sm">{error}</p>
                )}

                {!loading && !error && (
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-2 text-left w-6">#</th>
                                <th className="px-4 py-2 text-left">Joueur</th>
                                <th className="px-4 py-2 text-center">Éq.</th>
                                <th className="px-4 py-2 text-center">{statLabel}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, i) => (
                                <tr
                                    key={player.id}
                                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    {/* Rang */}
                                    <td className="px-4 py-2.5 text-slate-500 text-xs font-mono">
                                        {i + 1}
                                    </td>

                                    {/* Joueur */}
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={player.headshot}
                                                alt={player.name}
                                                className="w-8 h-8 rounded-full object-cover bg-white/10 shrink-0"
                                                onError={(e) => { e.target.style.display = "none" }}
                                            />
                                            <span className="text-sm font-medium truncate max-w-[120px]">
                                                {player.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Équipe */}
                                    <td className="px-4 py-2.5 text-center text-xs text-slate-400 font-semibold">
                                        {player.team}
                                    </td>

                                    {/* Stat principale */}
                                    <td className="px-4 py-2.5 text-center">
                                        <span className="text-base font-bold">
                                            {player.value}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

// ── TopScorers ──

const TopScorers = () => (
    <section className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-left">STATISTIQUES NHL</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBlock
                title="Meilleurs buteurs"
                emoji="🚨"
                endpoint="top-scorers"
                statLabel="Buts"
            />
            <StatBlock
                title="Meilleurs passeurs"
                emoji="🍎"
                endpoint="top-assisters"
                statLabel="Passes"
            />
        </div>
    </section>
)

export default TopScorers
