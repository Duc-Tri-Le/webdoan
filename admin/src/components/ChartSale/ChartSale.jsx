import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartSale = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalRevenue" fill="#4caf50" name="Doanh thu" />
        <Bar dataKey="totalRefund" fill="#f44336" name="Hoàn tiền" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartSale;
