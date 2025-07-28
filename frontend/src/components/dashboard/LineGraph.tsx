import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'January',
    Expenses: 4000,
    Revenue: 2400,
    amt: 2400,
  },
  {
    name: 'February',
    Expenses: 3000,
    Revenue: 1398,
    amt: 2210,
  },
  {
    name: 'March',
    Expenses: 2000,
    Revenue: 9800,
    amt: 2290,
  },
  {
    name: 'April',
    Expenses: 2780,
    Revenue: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    Expenses: 1890,
    Revenue: 4800,
    amt: 2181,
  },
  {
    name: 'June',
    Expenses: 2390,
    Revenue: 3800,
    amt: 2500,
  },
  {
    name: 'July',
    Expenses: 3490,
    Revenue: 4300,
    amt: 2100,
  },
];

const LineGraph = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Expenses" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineGraph
