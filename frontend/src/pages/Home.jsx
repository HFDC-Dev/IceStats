import TodayGames from "../components/TodayGames"
import TopScorers from "../components/TopScorers"

const Home = () => {
    return (
        <main className="text-center px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">LES MATCHS 🏒</h1>

            <TodayGames />
            <TopScorers />
        </main>
    )
}

export default Home
