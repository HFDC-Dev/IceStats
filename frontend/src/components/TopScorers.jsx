import { useEffect, useState } from "react"
import axios from "axios"

const TopScorers = () => {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTopScorers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/stats/top-scorers"
                )
                setPlayers(res.data)
            } catch {
                setError("Impossible de charger les meilleurs buteurs")
            } finally {
                setLoading(false)
            }
        }

        fetchTopScorers()
    }, [])

    if (loading) {
        return <p className="text-center text-slate-400">Chargement...</p>
    }

    if (error) {
        return <p className="text-center text-red-400">{error}</p>
    }

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-left">
                🔥 MEILLEURS BUTEURS NHL
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-xl overflow-hidden">
                    <thead className="bg-slate-700 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 text-left">Joueur</th>
                            <th className="px-4 py-3 text-center">Équipe</th>
                            <th className="px-4 py-3 text-center">Buts</th>
                            <th className="px-4 py-3 text-center">MJ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr
                                key={player.id}
                                className="border-t border-slate-700 hover:bg-slate-700/50"
                            >
                                <td className="px-4 py-3 flex items-center gap-3">
                                    <img
                                        src={player.headshot}
                                        alt={player.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span className="font-medium">{player.name}</span>
                                </td>
                                <td className="px-4 py-3 text-center font-semibold">
                                    {player.team}
                                </td>
                                <td className="px-4 py-3 text-center text-lg font-bold">
                                    {player.goals}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {player.gamesPlayed}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default TopScorers

