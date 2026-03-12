import { useEffect, useState } from "react"
import axios from "axios"
import GameCard from "./GameCard"

const TodayGames = () => {
    const [yesterdayGames, setYesterdayGames] = useState([])
    const [todayGames, setTodayGames] = useState([])
    const [tomorrowGames, setTomorrowGames] = useState([])
    const [fallbackGames, setFallbackGames] = useState([])
    const [h2hData, setH2hData] = useState({}) // clé : "HOME_AWAY"
    const [loading, setLoading] = useState(true)

    // Fetch principal : matchs 
    const fetchGames = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/games/today")

            setYesterdayGames(data.yesterday ?? [])
            setTodayGames(data.today ?? [])
            setTomorrowGames(data.tomorrow ?? [])
            setFallbackGames(data.fallback ?? [])

            // Lance les H2H pour les matchs du jour (statut non FINAL)
            const gamesToFetch = [
                ...(data.today ?? []).filter(g => !["OFF", "FINAL", "OVER"].includes(g.status)),
                ...(data.tomorrow ?? []),  // ← ajouté
            ]
            fetchAllH2H(gamesToFetch)
        } catch (err) {
            console.error("Erreur fetchGames:", err)
        } finally {
            setLoading(false)
        }
    }

    // Fetch H2H pour une liste de matchs 
    const fetchAllH2H = async (games) => {
        const results = await Promise.allSettled(
            games.map(g =>
                axios
                    .get(`http://localhost:5000/api/games/h2h?home=${g.home.abbrev}&away=${g.away.abbrev}`)
                    .then(r => ({ key: `${g.home.abbrev}_${g.away.abbrev}`, data: r.data }))
            )
        )

        const map = {}
        results.forEach(r => {
            if (r.status === "fulfilled") {
                map[r.value.key] = r.value.data
            }
        })
        setH2hData(map)
    }

    useEffect(() => {
        fetchGames()
        const interval = setInterval(fetchGames, 60000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-slate-400 text-lg animate-pulse">Chargement des matchs…</div>
            </div>
        )
    }

    const hasContent =
        yesterdayGames.length > 0 ||
        todayGames.length > 0 ||
        tomorrowGames.length > 0 ||
        fallbackGames.length > 0

    if (!hasContent) {
        return (
            <p className="text-slate-400 text-center py-10">
                Aucun match trouvé pour le moment.
            </p>
        )
    }

    return (
        <div className="space-y-12 pt-6">

            {/*  RÉSULTATS DE LA VEILLE  */}
            {yesterdayGames.length > 0 && (
                <Section title="Résultats d'hier" accent="text-slate-400">
                    <GameGrid>
                        {yesterdayGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </GameGrid>
                </Section>
            )}

            {/* MATCHS DU JOUR */}
            {todayGames.length > 0 && (
                <Section title="Matchs du jour" accent="text-blue-400">
                    <GameGrid>
                        {todayGames.map(game => (
                            <GameCard
                                key={game.id}
                                game={game}
                                h2h={h2hData[`${game.home.abbrev}_${game.away.abbrev}`] ?? null}
                            />
                        ))}
                    </GameGrid>
                </Section>
            )}

            {/* MATCHS À VENIR (demain)  */}
            {tomorrowGames.length > 0 && (
                <Section title="Matchs à venir" accent="text-indigo-400">
                    <GameGrid>
                        {tomorrowGames.map(game => (
                            <GameCard key={game.id} game={game} h2h={h2hData[`${game.home.abbrev}_${game.away.abbrev}`] ?? null} />
                        ))}
                    </GameGrid>
                </Section>
            )}

            {/* FALLBACK  */}
            {todayGames.length === 0 &&
                tomorrowGames.length === 0 &&
                fallbackGames.length > 0 && (
                    <Section title="Prochaine journée NHL" accent="text-indigo-400">
                        <GameGrid>
                            {fallbackGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </GameGrid>
                    </Section>
                )}
        </div>
    )
}

const Section = ({ title, accent, children }) => (
    <section>
        <h2 className={`text-xl font-bold mb-4 ${accent}`}>{title}</h2>
        {children}
    </section>
)

const GameGrid = ({ children }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
)

export default TodayGames