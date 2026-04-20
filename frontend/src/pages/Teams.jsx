import { useEffect, useState } from "react"
import axios from "axios"

const getNhlLogo = (abbrev) =>
    `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`



const shortName = (p) => p ? `${p.firstName[0]}. ${p.lastName}` : "—"

// Découpe les forwards en 4 lignes de 3 (LW / C / RW dans l'ordre du roster)
const buildLines = (forwards) => {
    const lines = []
    for (let i = 0; i < 4; i++) {
        const chunk = forwards.slice(i * 3, i * 3 + 3)
        lines.push({
            lw: chunk.find(p => p.position === "L") ?? chunk[0] ?? null,
            c: chunk.find(p => p.position === "C") ?? chunk[1] ?? null,
            rw: chunk.find(p => p.position === "R") ?? chunk[2] ?? null,
        })
    }
    return lines
}

// Découpe les défenseurs en 3 paires
const buildPairs = (defensemen) => {
    const pairs = []
    for (let i = 0; i < 3; i++) {
        pairs.push({
            d1: defensemen[i * 2] ?? null,
            d2: defensemen[i * 2 + 1] ?? null,
        })
    }
    return pairs
}

// ─── PlayerSpot ────
// Un joueur sur la patinoire SVG : photo ronde + nom + numéro

const PlayerSpot = ({ player, cx, cy, color, r = 22 }) => {
    const [imgOk, setImgOk] = useState(true)
    const name = shortName(player)

    return (
        <g>
            {/* Halo coloré */}
            <circle cx={cx} cy={cy} r={r + 4} fill={color} opacity="0.10" />


            {/* Photo ou initiale fallback */}
            {player?.headshot && imgOk ? (
                <>
                    <clipPath id={`clip-${player.id}`}>
                        <circle cx={cx} cy={cy} r={r - 1} />
                    </clipPath>
                    <image
                        href={player.headshot}
                        x={cx - (r - 1)} y={cy - (r - 1)}
                        width={(r - 1) * 2} height={(r - 1) * 2}
                        clipPath={`url(#clip-${player.id})`}
                        preserveAspectRatio="xMidYMid slice"
                        onError={() => setImgOk(false)}
                    />
                </>
            ) : (
                <text x={cx} y={cy + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                    {player?.firstName?.[0] ?? "?"}
                </text>
            )}

            {/* Nom */}
            <text x={cx} y={cy + r + 11}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="8.5" fontWeight="500" fontFamily="sans-serif">
                {name}
            </text>

            {/* Numéro */}
            {player?.number && (
                <text x={cx} y={cy + r + 21}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={color} fontSize="7.5" opacity="0.85" fontFamily="monospace">
                    #{player.number}
                </text>
            )}
        </g>
    )
}

// ─── IceRink ────

const IceRink = ({ goalie, d1, d2, lw, c, rw }) => (
    <div className="relative w-full" style={{ paddingBottom: "62%" }}>
        <svg
            viewBox="0 0 500 310"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
        >
            <defs>
                <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0c1a2e" />
                    <stop offset="100%" stopColor="#0f2744" />
                </linearGradient>
                <clipPath id="rinkClip">
                    <rect x="8" y="8" width="484" height="294" rx="52" ry="52" />
                </clipPath>
            </defs>

            {/* Fond */}
            <rect x="8" y="8" width="484" height="294" rx="52" ry="52"
                fill="url(#iceGrad)" stroke="#1e3a5f" strokeWidth="2.5" />

            {/* Lignes */}
            <line x1="8" y1="155" x2="492" y2="155" stroke="#ef4444" strokeWidth="3" opacity="0.65" />
            <line x1="8" y1="103" x2="492" y2="103" stroke="#3b82f6" strokeWidth="2.5" opacity="0.65" />
            <line x1="8" y1="207" x2="492" y2="207" stroke="#3b82f6" strokeWidth="2.5" opacity="0.65" />

            {/* Cercle central */}
            <circle cx="250" cy="155" r="32" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.45" />
            <circle cx="250" cy="155" r="3" fill="#ef4444" opacity="0.7" />

            {/* Points mise en jeu */}
            {[130, 370].map(x =>
                [78, 232].map(y => (
                    <g key={`${x}-${y}`}>
                        <circle cx={x} cy={y} r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.35" />
                        <circle cx={x} cy={y} r="3" fill="#ef4444" opacity="0.45" />
                    </g>
                ))
            )}

            {/* Filet */}
            <rect x="213" y="14" width="74" height="20" rx="4"
                fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.55" />
            <line x1="250" y1="14" x2="250" y2="34" stroke="#94a3b8" strokeWidth="1" opacity="0.35" />
            <path d="M 213 34 Q 250 56 287 34"
                fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />

            {/* Labels zones */}
            <text x="488" y="78" textAnchor="end" fill="#334155" fontSize="8" fontFamily="sans-serif">Zone déf.</text>
            <text x="488" y="232" textAnchor="end" fill="#334155" fontSize="8" fontFamily="sans-serif">Zone off.</text>

            {/* ── Joueurs ── */}
            {/* Gardien */}
            {goalie && <PlayerSpot player={goalie} cx={250} cy={46} color="#facc15" r={20} />}

            {/* Défenseurs */}
            {d1 && <PlayerSpot player={d1} cx={155} cy={130} color="#60a5fa" r={20} />}
            {d2 && <PlayerSpot player={d2} cx={345} cy={130} color="#60a5fa" r={20} />}

            {/* Attaquants */}
            {lw && <PlayerSpot player={lw} cx={110} cy={230} color="#34d399" r={20} />}
            {c && <PlayerSpot player={c} cx={250} cy={248} color="#34d399" r={20} />}
            {rw && <PlayerSpot player={rw} cx={390} cy={230} color="#34d399" r={20} />}
        </svg>
    </div>
)

// ─── LineSwitcher ───

const LineSwitcher = ({ activeLine, onChange }) => (
    <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map(n => (
            <button
                key={n}
                onClick={() => onChange(n)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
                    ${activeLine === n
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
            >
                Ligne {n}
            </button>
        ))}
    </div>
)

// ─── LineupModal ───

const LineupModal = ({ team, onClose }) => {
    const [lineup, setLineup] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeLine, setActiveLine] = useState(1)

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/teams/${team.abbrev}/lineup`)
            .then(({ data }) => setLineup(data))
            .catch(() => setLineup(null))
            .finally(() => setLoading(false))
    }, [team.abbrev])

    // Lignes et paires calculées depuis le roster
    const lines = lineup ? buildLines(lineup.forwards) : []
    const pairs = lineup ? buildPairs(lineup.defensemen) : []

    // La ligne active (index 0-based)
    const idx = activeLine - 1
    const line = lines[idx] ?? {}
    const pair = pairs[Math.min(idx, 2)] ?? {}   // max 3 paires, ligne 4 → paire 3
    const goalie = lineup?.goalies?.[activeLine === 1 ? 0 : 1] ?? lineup?.goalies?.[0] ?? null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                    <img src={getNhlLogo(team.abbrev)} alt={team.name} className="w-14 h-14 object-contain" />
                    <div>
                        <h2 className="text-xl font-bold text-white">{team.name}</h2>
                        <p className="text-slate-400 text-sm">Composition probable</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto text-slate-400 hover:text-white text-2xl leading-none transition-colors"
                    >✕</button>
                </div>

                {loading && (
                    <p className="text-slate-400 text-center py-16 animate-pulse">Chargement…</p>
                )}

                {!loading && !lineup && (
                    <p className="text-slate-500 text-center py-16">Composition indisponible.</p>
                )}

                {!loading && lineup && (
                    <>
                        {/* Switcher de ligne */}
                        <LineSwitcher activeLine={activeLine} onChange={setActiveLine} />

                        {/* Patinoire */}
                        <IceRink
                            goalie={goalie}
                            d1={pair.d1}
                            d2={pair.d2}
                            lw={line.lw}
                            c={line.c}
                            rw={line.rw}
                        />

                        {/* Légende */}
                        <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Gardien
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Défenseurs
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Attaquants
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ─── TeamLogo ───

const TeamLogo = ({ team, onClick }) => (
    <button
        onClick={() => onClick(team)}
        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200 group"
    >
        <img
            src={getNhlLogo(team.abbrev)}
            alt={team.name}
            className="w-16 h-16 object-contain group-hover:drop-shadow-lg transition-all"
            onError={(e) => { e.target.style.display = "none" }}
        />
        <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
            {team.name}
        </span>
    </button>
)

// ─── Teams ───

const Teams = () => {
    const [teams, setTeams] = useState(null)
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/teams")
            .then(({ data }) => setTeams(data))
            .catch(() => setTeams(null))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-slate-400 animate-pulse">Chargement des équipes…</p>
            </div>
        )
    }

    if (!teams) {
        return <p className="text-slate-500 text-center py-20">Impossible de charger les équipes.</p>
    }

    return (
        <main className="px-4 py-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-center">LES ÉQUIPES 🏒</h1>

            <div className="space-y-10">
                {Object.entries(teams).map(([conference, divisions]) => (
                    <section key={conference}>
                        <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest mb-4">
                            Conférence {conference}
                        </h2>
                        <div className="space-y-6">
                            {Object.entries(divisions).map(([division, divTeams]) => (
                                <div key={division}>
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 border-b border-white/10 pb-1">
                                        Division {division}
                                    </h3>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                                        {divTeams.map(team => (
                                            <TeamLogo key={team.abbrev} team={team} onClick={setSelectedTeam} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {selectedTeam && (
                <LineupModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
            )}
        </main>
    )
}

export default Teams