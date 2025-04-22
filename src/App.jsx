import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/ranking`)
      .then(res => {
        setRanking(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>🏁 Ranking Strava</h1>

      {loading && <p>Carregando...</p>}

      {!loading && ranking.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Colocação</th>
              <th>Atleta</th>
              <th>Total KM</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}º</td>
                <td>{p.atleta}</td>
                <td>{p.total_km.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>👋 Você ainda não está no ranking.</p>
          <a href={`${API_URL}/auth/strava`}>
            <button style={{ padding: 10, fontSize: 16, cursor: "pointer" }}>
              🚴‍♂️ Entrar com Strava
            </button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;