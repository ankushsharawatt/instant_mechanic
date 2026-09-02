import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BookingData {
  date: string;
  bookings: number;
}

interface BookingsChartProps {
  data: BookingData[];
}

export default function BookingsChart({
  data,
}: BookingsChartProps) {
  console.log("Chart received:", data);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Bookings Over Time
      </h2>

      <div
        style={{
          width: "100%",
          height: "300px",
          minWidth: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} onMouseMove={(state) => console.log('Chart mousemove:', state)} onMouseLeave={() => console.log('Chart mouseleave')}>
            <CartesianGrid stroke="#e5e7eb" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#000000"
              strokeWidth={3}
              dot={{ r: 4 }}
              isAnimationActive={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}