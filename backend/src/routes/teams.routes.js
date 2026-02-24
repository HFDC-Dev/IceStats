import express from "express"
import { getAllTeams } from "../services/nhl.service.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const teams = await getAllTeams()
        res.json(teams)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Erreur lors de la récupération des équipes NHL"
        })
    }
})

export default router