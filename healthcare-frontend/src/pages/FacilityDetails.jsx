import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

const FacilityDetails = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await API.get(`/facilities/${id}`);
        setFacility(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load facility details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacility();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-slate-600">
        Loading facility details...
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-slate-600">
        <p className="text-lg font-semibold text-red-600">{error || "Facility not found."}</p>
        <Link to="/" className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-4xl bg-white p-6 shadow-lg">
          <img
            src={facility.image}
            alt={facility.title}
            className="h-96 w-full rounded-3xl object-cover"
          />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-700">Facility Overview</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{facility.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{facility.description}</p>
          </div>
        </div>

        <div className="rounded-4xl bg-slate-900 p-6 text-white shadow-lg">
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">Book appointments or request support</h2>
              <p className="mt-3 text-sm text-slate-300">
                Use the online booking system to reserve a consultation or request a demo for this facility.
              </p>
            </div>

            <Link
              to="/book-appointment"
              className="block rounded-3xl bg-blue-500 px-5 py-4 text-center text-base font-semibold text-white transition hover:bg-blue-600"
            >
              Book Appointment
            </Link>

            <Link
              to="/bookdemo"
              className="block rounded-3xl bg-slate-800 px-5 py-4 text-center text-base font-semibold text-white ring-1 ring-white/15 transition hover:bg-slate-700"
            >
              Request a Free Demo
            </Link>

            <a
              href="https://wa.me/919999999999?text=I%20want%20to%20learn%20more%20about%20this%20facility"
              target="_blank"
              rel="noreferrer"
              className="block rounded-3xl border border-white/20 bg-white/5 px-5 py-4 text-center text-base font-semibold text-white transition hover:border-blue-300 hover:text-blue-200"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilityDetails;
