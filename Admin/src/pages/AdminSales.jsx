// admin/src/pages/AdminSales.jsx
import { useQuery } from "@tanstack/react-query";
import { getSalesOverviewApi } from "../api/adminSalesApi";

export default function AdminSales() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales-overview"],
    queryFn: () => getSalesOverviewApi().then((res) => res.data.data),
  });

  const totalRevenue = sales?.reduce((sum, d) => sum + d.revenue, 0) || 0;
  const totalOrders = sales?.reduce((sum, d) => sum + d.orders, 0) || 0;
  const maxRevenue = Math.max(...(sales?.map((d) => d.revenue) || [1]));

  return (
    <div>
      <h1 className="text-white text-xl font-light mb-6">Sales — Last 30 Days</h1>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#14151a] p-5 rounded-lg">
          <p className="text-gray-500 text-xs">Revenue (30 days)</p>
          <p className="text-white text-2xl font-light mt-2">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-[#14151a] p-5 rounded-lg">
          <p className="text-gray-500 text-xs">Orders (30 days)</p>
          <p className="text-white text-2xl font-light mt-2">{totalOrders}</p>
        </div>
      </div>

      {/* Simple bar visualization — no chart library needed */}
      <div className="bg-[#14151a] p-5 rounded-lg">
        <p className="text-xs tracking-widest text-gray-400 mb-4">DAILY REVENUE</p>
        {!isLoading && sales?.length === 0 && <p className="text-gray-500 text-sm">No paid orders yet in this window.</p>}
        <div className="space-y-2">
          {sales?.map((day) => (
            <div key={day._id} className="flex items-center gap-3">
              <span className="text-gray-500 text-[10px] w-16 shrink-0">{day._id.slice(5)}</span>
              <div className="flex-1 bg-white/5 rounded h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#C9962F] to-[#F0D68A] h-full"
                  style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="text-gray-300 text-[10px] w-20 text-right">₹{day.revenue.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}