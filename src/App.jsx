import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://strava-backend-91ww.onrender.com"

function formatDateInput(date) {
  return date.toISOString().slice(0, 10)
}

function App() {
  const [ranking, setRanking] = useState([])
  const [weeklyRankings, setWeeklyRankings] = useState([])
  const [athleteName, setAthleteName] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("")
  const [startDate, setStartDate] = useState(() => {
    let d = new Date()
    d.setDate(1)
    return d
  })
  const [endDate, setEndDate] = useState(() => new Date())
  const [type, setType] = useState("all")

  // Pega nome do atleta do localStorage
  useEffect(() => {
    setAthleteName(localStorage.getItem("athlete_name") || "")
  }, [])

  // Busca ranking principal e última atualização
  useEffect(() => {
    setLoading(true)
    let url = `${API_URL}/ranking?start=${formatDateInput(startDate)}&end=${formatDateInput(endDate)}`
    if (type !== "all") url += `&type=${type}`
    axios.get(url)
      .then(res => setRanking(res.data))
      .catch(() => setRanking([]))
      .finally(() => setLoading(false))
    axios.get(`${API_URL}/last_update`)
      .then(res => setLastUpdate(res.data.last_update
        ? new Date(res.data.last_update).toLocaleString()
        : "Nunca"))
  }, [startDate, endDate, type])

  // Busca rankings semanais
  useEffect(() => {
    let url = `${API_URL}/ranking_weekly?start=${formatDateInput(startDate)}&end=${formatDateInput(endDate)}`
    if (type !== "all") url += `&type=${type}`
    axios.get(url)
      .then(res => setWeeklyRankings(res.data))
      .catch(() => setWeeklyRankings([]))
  }, [startDate, endDate, type])

  const isInRanking = ranking.some(item => item.atleta === athleteName)

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-3">🏃‍♂️ Ranking Strava</h1>

      <div className="mb-3 text-sm text-gray-300">
        Última atualização: {lastUpdate}
      </div>

      {/* Seletor de data início/fim + tipo */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <input
          type="date"
          value={formatDateInput(startDate)}
          max={formatDateInput(endDate)}
          onChange={e => setStartDate(new Date(e.target.value))}
          className="bg-gray-700 rounded p-1"
        />
        <span>a</span>
        <input
          type="date"
          value={formatDateInput(endDate)}
          min={formatDateInput(startDate)}
          max={formatDateInput(new Date())}
          onChange={e => setEndDate(new Date(e.target.value))}
          className="bg-gray-700 rounded p-1"
        />
        <select value={type} onChange={e=>setType(e.target.value)} className="bg-gray-700 rounded p-1">
          <option value="all">Corrida + Caminhada</option>
          <option value="run">Corrida</option>
          <option value="walk">Caminhada</option>
        </select>
      </div>

      {!isInRanking && (
        <a
          href={`${API_URL}/auth/strava`}
          className="mb-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Participar do Desafio
        </a>
      )}

      {/* Ranking Principal */}
      <div className="w-full max-w-md bg-white text-black rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-10 text-lg font-semibold text-gray-700">Atualizando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            Nenhum registro para este filtro.
          </div>
        ) : (
          ranking.map((item, index) => (
            <div key={index} className="flex justify-between border-b border-gray-300 py-2 items-center">
              <span className="flex items-center gap-2">
                <span>{index + 1}º</span>
                {item.profile && <img src={item.profile} alt="avatar" className="w-8 h-8 rounded-full border" />}
                {item.atleta}
              </span>
              <span className="font-bold">{item.total_km} km</span>
            </div>
          ))
        )}
      </div>

      {/* Rankings Semanais */}
      <div className="w-full max-w-md mt-10">
        {weeklyRankings.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2 text-white text-center">🏅 Rankings Semanais</h2>
            {weeklyRankings.map((week, i) => (
              <div key={i} className="bg-white/10 rounded-xl shadow p-3 mb-6">
                <div className="font-bold text-sm mb-2">{week.label}</div>
                {week.ranking.length === 0 ? (
                  <div className="text-gray-300 text-center">Sem registros.</div>
                ) : (
                  week.ranking.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-gray-300 py-1 items-center">
                      <span className="flex items-center gap-2">
                        <span>{idx + 1}º</span>
                        {item.profile_picture && (
                          <img src={item.profile_picture} alt="avatar" className="w-7 h-7 rounded-full border" />
                        )}
                        {item.name}
                      </span>
                      <span className="font-bold">{item.km} km</span>
                    </div>
                  ))
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default App