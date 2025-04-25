// components/RankingList.jsx
export function RankingList({ ranking, title = "Ranking" }) {
  if (!ranking?.length) return null;

  return (
    <div className="bg-white/10 rounded-xl shadow p-4 mb-8">
      <h2 className="font-bold mb-4 text-lg">{title}</h2>
      <ol>
        {ranking.map((item, idx) => (
          <li key={item.id || idx} className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{idx + 1}º</span>
            {item.profile_picture && (
              <img src={item.profile_picture} alt="" className="w-8 h-8 rounded-full" />
            )}
            <span>{item.name}</span>
            <span className="ml-auto font-bold">{item.km.toFixed(2)} km</span>
          </li>
        ))}
      </ol>
    </div>
  );
}