// components/PeriodSelector.jsx
import { useState } from "react";

export function PeriodSelector({ onChange }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Primeiro dia do mês
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  function handleChange(type, value) {
    if (type === "start") setStartDate(value);
    else setEndDate(value);
    onChange(
      type === "start" ? value : startDate,
      type === "end" ? value : endDate
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate.toISOString().split('T')[0]}
        onChange={e => handleChange("start", new Date(e.target.value))}
        className="border rounded p-2"
      />
      <span>a</span>
      <input
        type="date"
        value={endDate.toISOString().split('T')[0]}
        onChange={e => handleChange("end", new Date(e.target.value))}
        className="border rounded p-2"
      />
    </div>
  );
}