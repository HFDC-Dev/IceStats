import { useEffect, useState } from "react"
import axios from "axios"
import GameCard from "./GameCard"

const TodayGames = () => {
    const [todayGames, setTodayGames] = useState([])
    const [tomorrowGames, setTomorrowGames] = useState([])
    const [fallbackGames, setFallbackGames] = useState([])
    const [loading, setLoading] = useState(true)

    const sortGames = (games) => {
        return [...games].sort((a, b) => {
            if (a.status === "LIVE" && b.status !== "LIVE") return -1
            if (b.status === "LIVE" && a.status !== "LIVE") return 1
            return new Date(a.startTimeUTC) - new Date(b.startTimeUTC)
        })
    }

    const fetchGames = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/games/today")

            setTodayGames(sortGames(res.data.today))
            setTomorrowGames(sortGames(res.data.tomorrow))
            setFallbackGames(sortGames(res.data.fallback || []))

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGames()
        const interval = setInterval(fetchGames, 60000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return <p className="text-slate-400 text-center">Chargement...</p>
    }

    return (
        <div className="space-y-10 pt-10 sm:pt-10">

            {/* MATCHS DU JOUR */}
            {todayGames.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Matchs du jour</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {todayGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </section>
            )}

            {/* MATCHS DE DEMAIN */}
            {tomorrowGames.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Matchs à venir</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tomorrowGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </section>
            )}

            {/* FALLBACK SI RIEN */}
            {todayGames.length === 0 &&
                tomorrowGames.length === 0 &&
                fallbackGames.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">
                            Prochaine journée NHL
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {fallbackGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    </section>
                )}

        </div>
    )
}

export default TodayGames