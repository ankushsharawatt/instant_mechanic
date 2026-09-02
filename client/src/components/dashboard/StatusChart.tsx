import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusData {
  status: string;
  count: number;
}

interface StatusChartProps {
  data: StatusData[];
}

const COLORS = [
  "#18181b",
  "#52525b",
  "#71717a",
  "#a1a1aa",
  "#d4d4d8",
  "#e4e4e7",
];

export default function StatusChart({
  data,
}: StatusChartProps) {
  console.log("Status chart data:", data);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">
        Booking Status
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Distribution of booking statuses
      </p>

      <div
        style={{
          width: "100%",
          height: "320px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((item, index) => (
          <div
            key={item.status}
            className="flex items-center gap-2 text-xs text-zinc-600"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length],
              }}
            />

            <span>
              {item.status.replaceAll("_", " ")} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}