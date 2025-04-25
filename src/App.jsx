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
    axios.get(`${API_URL}/last_update`)
  .then(res => {
    console.log('Valor vindo do backend:', res.data.last_update); // <--- adicione isso
    setLastUpdate(
      res.data.last_update
        ? (() => {
            // Código temporário, pode deixar aqui
            const d = new Date(res.data.last_update);
            d.setHours(d.getHours() - 3);
            return d.toLocaleString('pt-BR');
          })()
        : "Nunca" 
  )
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

  // Função para dividir os rankings semanais em grid 2x2
  const getWeeklyGrid = () => {
    const grid = [[], []]
    weeklyRankings.slice(0, 4).forEach((semana, idx) => {
      grid[Math.floor(idx / 2)].push(semana)
    })
    return grid
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px 0 40px 0', background: '#C30000', color: '#fff' }} className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-3 text-center" style={{ color: '#fff' }}>
        🏃‍♂️ Ranking Ultra Movimento
      </h1>

      <div className="mb-3 text-sm text-gray-100" style={{ color: '#ffe' }}>
        Última atualização: {lastUpdate}
      </div>

      {/* Seletor de data início/fim + tipo */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <input
          type="date"
          value={formatDateInput(startDate)}
          max={formatDateInput(endDate)}
          onChange={e => setStartDate(new Date(e.target.value))}
          className="rounded p-1"
          style={{ background: "#fff", color: "#333" }}
        />
        <span style={{ color: "#fff" }}>a</span>
        <input
          type="date"
          value={formatDateInput(endDate)}
          min={formatDateInput(startDate)}
          max={formatDateInput(new Date())}
          onChange={e => setEndDate(new Date(e.target.value))}
          className="rounded p-1"
          style={{ background: "#fff", color: "#333" }}
        />
        <select value={type} onChange={e => setType(e.target.value)} className="rounded p-1" style={{ background: "#fff", color: "#333" }}>
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
      <div className="w-full max-w-md bg-white text-black rounded-lg shadow-md p-6 mb-8" style={{ margin: "0 auto" }}>
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
      <div className="w-full mt-8 flex flex-col items-center justify-center">
        {weeklyRankings.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-white text-center">🏅 Rankings Semanais</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", maxWidth: 900 }}>
              {weeklyRankings.slice(0, 4).map((week, i) => (
                <div key={i} className="bg-white rounded-lg shadow text-black p-5" style={{ minWidth: 290 }}>
                  <div className="font-bold text-sm mb-2 text-center">{week.label}</div>
                  {week.ranking.length === 0 ? (
                    <div className="text-gray-500 text-center">Sem registros.</div>
                  ) : (
                    week.ranking.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-300 py-2 items-center">
                        <span className="flex items-center gap-2">
                          <span>{idx + 1}º</span>
                          {item.profile && (
                            <img src={item.profile} alt="avatar" className="w-7 h-7 rounded-full border" />
                          )}
                          {item.atleta}
                        </span>
                        <span className="font-bold">{item.total_km} km</span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App