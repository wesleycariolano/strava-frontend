import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://strava-backend-91ww.onrender.com"

function App() {
  const [ranking, setRanking] = useState([])
  const [athleteName, setAthleteName] = useState("")

  useEffect(() => {
    setAthleteName(localStorage.getItem("athlete_name") || "")
    axios.get(`${API_URL}/ranking`)
      .then(res => setRanking(res.data))
      .catch(() => setRanking([]))
  }, [])

  const isInRanking = ranking.some(item => item.atleta === athleteName)

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🏃‍♂️ Ranking Mensal - Strava</h1>

      {!isInRanking && (
        <a
          href={`${API_URL}/auth/strava`}
          className="mb-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Participar do Desafio
        </a>
      )}

      <div className="w-full max-w-md bg-white text-black rounded-lg shadow-md p-6">
        {ranking.map((item, index) => (
          <div key={index} className="flex justify-between border-b border-gray-300 py-2">
            <span>{index + 1}º {item.atleta}</span>
            <span>{item.total_km} km</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App