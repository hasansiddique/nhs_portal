import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList} from "recharts";

type ProductViewsChartProps = {
  data: { viewCount: number; month: string }[];
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

export const ProductViewsChart: React.FC<ProductViewsChartProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    view_count: Number(item.viewCount),
  }));

  const maxViewCount = Math.max(...formattedData.map((item) => item.view_count));
  const yDomainMax = maxViewCount + maxViewCount * 0.1;

  return (
    <div className="">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formattedData}>
          <XAxis
            dataKey="month"
            tick={{ fill: "#aaa", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, yDomainMax]} />
          <Bar dataKey="view_count" fill="#FF7133" radius={4} barSize={16}>
            <LabelList dataKey="view_count" position="top" fill="#fff" fontWeight={"bold"} fontSize={10} formatter={(value: number) => formatNumber(value)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
