import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://strava-backend-91ww.onrender.com"

function App() {
  const [ranking, setRanking] = useState([])
  const [athleteName, setAthleteName] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [weeks, setWeeks] = useState([])
  const [week, setWeek] = useState("")
  const [type, setType] = useState("all")

  // Pega nome do atleta do localStorage
  useEffect(() => {
    setAthleteName(localStorage.getItem("athlete_name") || "")
  }, [])

  // Busca semanas do mês
  useEffect(() => {
    axios.get(`${API_URL}/weeks?year=${year}&month=${month}`)
      .then(res => setWeeks(res.data))
      .catch(() => setWeeks([]))
  }, [year, month])

  // Busca ranking e data da última atualização
  useEffect(() => {
    setLoading(true)
    let url = `${API_URL}/ranking?year=${year}&month=${month}`
    if (week) url += `&week=${week}`
    if (type !== "all") url += `&type=${type}`
    axios.get(url)
      .then(res => setRanking(res.data))
      .catch(() => setRanking([]))
      .finally(() => setLoading(false))
    axios.get(`${API_URL}/last_update`)
      .then(res => setLastUpdate(res.data.last_update
        ? new Date(res.data.last_update).toLocaleString()
        : "Nunca"))
  }, [year, month, week, type])

  const isInRanking = ranking.some(item => item.atleta === athleteName)
  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ]

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-3">🏃‍♂️ Ranking Strava</h1>

      <div className="mb-3 text-sm text-gray-300">
        Última atualização: {lastUpdate}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <select value={year} onChange={e=>setYear(Number(e.target.value))} className="bg-gray-700 rounded p-1">
          {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={e=>setMonth(Number(e.target.value))} className="bg-gray-700 rounded p-1">
          {months.map((m,i) => <option key={m} value={i+1}>{m}</option>)}
        </select>
        <select value={week} onChange={e=>setWeek(e.target.value)} className="bg-gray-700 rounded p-1">
          <option value="">Mês inteiro</option>
          {weeks.map(w => (
            <option key={w.week} value={w.week}>
              {w.start} a {w.end}
            </option>
          ))}
        </select>
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
    </div>
  )
}

export default App