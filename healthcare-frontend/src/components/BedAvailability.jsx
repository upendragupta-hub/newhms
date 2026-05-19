import { useEffect, useState } from "react";
import API from "../utils/api";

const BedAvailability = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get("/beds/summary");
        setSummary(response.data.summary);
      } catch (err) {
        setError("Unable to load bed availability at the moment.");
        console.error(err);
      }
    };

    fetchSummary();
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <p className="text-sm text-gray-500">Loading bed availability...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="rounded-3xl bg-blue-50 p-6 shadow-sm ring-1 ring-blue-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-700">Real-time bed availability</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Live bed management dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Track available beds, occupied beds and maintenance status in real time. Hospital administrators can manage the inventory instantly.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Available</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{summary.available}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Occupied</p>
              <p className="mt-2 text-3xl font-bold text-rose-600">{summary.occupied}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Maintenance</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{summary.maintenance}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BedAvailability;
