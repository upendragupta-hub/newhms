import { useEffect, useState } from "react";
import API from "../utils/api";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ward: "General",
    roomNumber: "",
    type: "General",
    status: "available",
    patientName: "",
    notes: "",
  });
  const [error, setError] = useState(null);

  const fetchBeds = async () => {
    try {
      const response = await API.get("/beds");
      setBeds(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load bed inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.roomNumber) {
      setError("Room number is required.");
      return;
    }

    try {
      setError(null);
      await API.post("/beds", form);
      setForm({
        ward: "General",
        roomNumber: "",
        type: "General",
        status: "available",
        patientName: "",
        notes: "",
      });
      fetchBeds();
    } catch (err) {
      console.error(err);
      setError("Failed to save bed details.");
    }
  };

  const updateStatus = async (bedId, status) => {
    try {
      await API.put(`/beds/${bedId}`, { status });
      fetchBeds();
    } catch (err) {
      console.error(err);
      setError("Unable to update bed status.");
    }
  };

  const deleteBed = async (bedId) => {
    try {
      await API.delete(`/beds/${bedId}`);
      fetchBeds();
    } catch (err) {
      console.error(err);
      setError("Unable to delete bed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-4xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Bed Management</h2>
            <p className="mt-2 text-slate-600">
              Manage bed inventory, change status in real time, and keep the ward status up to date.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-3xl bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            name="roomNumber"
            value={form.roomNumber}
            onChange={handleChange}
            placeholder="Room number"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          />
          <input
            name="ward"
            value={form.ward}
            onChange={handleChange}
            placeholder="Ward name"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          >
            <option value="General">General</option>
            <option value="ICU">ICU</option>
            <option value="Private">Private</option>
            <option value="Semi-Private">Semi-Private</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            placeholder="Patient name"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          />
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          />
          <button
            type="submit"
            className="rounded-3xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Add bed
          </button>
        </form>
      </div>

      <div className="rounded-4xl bg-white p-6 shadow-lg">
        <h3 className="text-2xl font-semibold text-slate-900">Current bed inventory</h3>
        {loading ? (
          <p className="mt-4 text-slate-500">Loading beds…</p>
        ) : beds.length === 0 ? (
          <p className="mt-4 text-slate-500">No beds have been added yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {beds.map((bed) => (
              <div key={bed._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{bed.roomNumber}</p>
                    <p className="text-sm text-slate-500">{bed.ward} · {bed.type}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bed.status === "available" ? "bg-emerald-100 text-emerald-700" : bed.status === "occupied" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                      {bed.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateStatus(bed._id, bed.status === "available" ? "occupied" : "available")}
                      className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Toggle Status
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBed(bed._id)}
                      className="rounded-full bg-rose-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {bed.patientName && (
                  <p className="mt-4 text-sm text-slate-600">Patient: {bed.patientName}</p>
                )}
                {bed.notes && (
                  <p className="mt-2 text-sm text-slate-500">Notes: {bed.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BedManagement;
