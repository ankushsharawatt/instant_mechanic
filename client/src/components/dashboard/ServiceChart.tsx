import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ServiceData {
  category: string;
  bookings: number;
  revenue: number;
}

interface ServiceChartProps {
  data: ServiceData[];
}

export default function ServiceChart({
  data,
}: ServiceChartProps) {
  console.log("SERVICE CHART DATA:", data);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          Service Breakdown
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Bookings by service category
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: "300px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 40,
            }}
          >
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="category"
              angle={-25}
              textAnchor="end"
              tick={{ fontSize: 11 }}
              interval={0}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
            />

            <Tooltip />

            <Bar
              dataKey="bookings"
              fill="#18181b"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}