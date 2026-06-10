import { useEffect, useState } from "react"
import axios from "axios"
import GameCard from "../components/GameCard"

const Results = () => {
    const [yesterdayGames, setYesterdayGames] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/games/today")
            .then(({ data }) => setYesterdayGames(data.yesterday ?? []))
            .catch((err) => console.error("Erreur fetchGames:", err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="text-slate-400 text-lg animate-pulse">Chargement des matchs…</div>
        </div>
    )

    if (yesterdayGames.length === 0) return (
        <p className="text-slate-400 text-center py-10">Aucun résultat disponible.</p>
    )

    return (
        <main className="px-4 py-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">RÉSULTATS 🏒</h1>
            <Section>
                <GameGrid count={yesterdayGames.length}>
                    {yesterdayGames.map(game => (
                        <GameCard key={game.id} game={game} showScoring={true} />
                    ))}
                </GameGrid>
            </Section>
        </main>
    )
}

const Section = ({ title, accent, children }) => (
    <section>
        <h2 className={`text-xl font-bold mb-4 ${accent}`}>{title}</h2>
        {children}
    </section>
)

const GameGrid = ({ children, count }) => (
    <div className={`grid gap-4 
        ${count === 1
            ? "grid-cols-1 max-w-lg mx-auto"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}>
        {children}
    </div>
)

export default Results