import { useEffect, useState } from "react"
import axios from "axios"
import GameCard from "./GameCard"

const TodayGames = () => {
    const [todayGames, setTodayGames] = useState([])
    const [tomorrowGames, setTomorrowGames] = useState([])
    const [loading, setLoading] = useState(true)


    // fonction asynchrone qui va chercher les données depuis backend
    const fetchGames = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/games/today")
            setTodayGames(res.data.today)
            setTomorrowGames(res.data.tomorrow)
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
            <section>
                <h2 className="text-xl font-bold mb-4">Matchs du jour</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {todayGames.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </section>

            {/* MATCHS À VENIR */}
            {tomorrowGames.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">
                        Matchs à venir
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tomorrowGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    )
}

export default TodayGames

