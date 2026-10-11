import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', spending: 4000 },
  { name: 'Feb', spending: 3000 },
  { name: 'Mar', spending: 2000 },
  { name: 'Apr', spending: 2780 },
  { name: 'May', spending: 1890 },
  { name: 'Jun', spending: 2390 },
];

export default function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
        <Line type="monotone" dataKey="spending" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
