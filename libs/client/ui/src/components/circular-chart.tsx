import { PieChart, Pie, Cell } from "recharts";

type CircularChartProps = {
  total: number;
  sold: number;
};

export const CircularChart: React.FC<CircularChartProps> = ({ total, sold }) => {
  const remaining = total - sold;

  const data = [
    { name: "Sold", value: sold, color: "#ef6a3b" }, // Orange
    { name: "Remaining", value: remaining, color: "#373737" }, // Darker grey
  ];

  return (
    <div className="relative flex flex-col justify-center items-center h-full">
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={70}
          startAngle={-90}
          endAngle={270}
          paddingAngle={0}
          dataKey="value"
          stroke="none" // Removes white border
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute text-white text-center">
        <p className="font-semibold">{sold} Sold</p>
        <p className="text-[14px] text-[#C5B6B3]">/ {total} Listed</p>
      </div>
    </div>
  );
};
