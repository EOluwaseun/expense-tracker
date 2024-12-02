// reactChart is used
import {
  //   CartesianAxis,
  //   CartesianGrid,
  Cell,
  Legend,
  //   Line,
  //   LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  //   XAxis,
  //   YAxis,
} from 'recharts';
import Title from './Title';

// colors coming from doc
const COLORS = ['#0088FE', '#FF8828', '#FF8042', '#00C49F'];

// eslint-disable-next-line react/prop-types
function DoughutChart({ dt }) {
  const data = [
    // eslint-disable-next-line react/prop-types
    { name: 'Income', value: Number(dt?.income) },
    // eslint-disable-next-line react/prop-types
    { name: 'Expense', value: Number(dt?.expense) },
  ];
  return (
    <div
      className="w-full md:w-2/3 flex flex-col items-center
    bg-gray-50 dark:bg-transparent"
    >
      <Title title={'Summary'} />
      <ResponsiveContainer width={'100%'} height={500}>
        <PieChart height={400} width={500}>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            innerRadius={110}
            outerRadius={180}
            fill="#8884d8"
            paddingAngle={5}
            dataKey={'value'}
          >
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DoughutChart;
