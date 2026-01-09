import TodayGames from "../components/TodayGames"

const Home = () => {
    return (
        <main className="text-center px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">MATCH DU JOUR 🏒</h1>

            <TodayGames />
        </main>
    )
}

export default Home
