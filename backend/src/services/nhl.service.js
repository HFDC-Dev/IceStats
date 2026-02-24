import axios from "axios"

export const getAllTeams = async () => {
    const { data } = await axios.get(
        "https://api.balldontlie.io/nhl/v1/teams",
        {
            headers: {
                Authorization: process.env.BALLDONTLIE_API_KEY
            }
        }
    )

    return data.data.map(team => ({
        id: team.id,
        name: team.full_name,
        abbreviation: team.abbreviation
    }))
}
