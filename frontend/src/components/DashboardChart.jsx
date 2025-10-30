import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  bajo: '#4CAF50',
  medio: '#FFC107',
  alto: '#F44336',
};

export const AforoDistributionChart = ({ data }) => {
  const chartData = [
    { name: 'Disponible', value: data.bajo, color: COLORS.bajo },
    { name: 'Moderado', value: data.medio, color: COLORS.medio },
    { name: 'Lleno', value: data.alto, color: COLORS.alto },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const PeakHoursChart = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.hour - b.hour);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" label={{ value: 'Hora del día', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Promedio de personas', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="avg_people" fill="#4CAF50" name="Promedio de personas" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DailyTrendChart = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avg_people" fill="#4CAF50" name="Promedio" />
        <Bar dataKey="max_people" fill="#FFC107" name="Máximo" />
      </BarChart>
    </ResponsiveContainer>
  );
};
