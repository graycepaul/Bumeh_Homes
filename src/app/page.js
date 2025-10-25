"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: "Quarry",
      description: "Sand, Stones, Dust supply",
    },
    {
      id: 2,
      name: "Block Industry",
      description: "Concrete blocks production",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBusiness, setNewBusiness] = useState({ name: "", description: "" });

  const handleAddBusiness = () => {
    if (!newBusiness.name) return;

    const nextId = businesses.length
      ? Math.max(...businesses.map((b) => b.id)) + 1
      : 1;
    setBusinesses([...businesses, { id: nextId, ...newBusiness }]);
    setNewBusiness({ name: "", description: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bumeh Homes
            </h1>
            <p className="text-slate-600 text-sm">
              Business Management Ecosystem
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/50">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">
              {businesses.length} businesses
            </span>
          </div>
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Business Cards */}
          {businesses.map((business) => (
            <div
              key={business.id}
              onClick={() => router.push(`/business/${business.id}`)}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8  shadow-sm hover:shadow-xl cursor-pointer transition-all duration-500 border border-white/50 hover:border-white/80 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {business.name.charAt(0)}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transform group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl sm:text-md lg:text-lg font-bold text-slate-900 mb-1 sm:mb-3 group-hover:text-slate-800 transition-colors duration-300 min-w-fit">
                {business.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {business.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <div className="flex items-center text-sm text-slate-500">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View details
                </div>
              </div>
            </div>
          ))}

          {/* Add Business Card */}
          <div
            onClick={() => setShowModal(true)}
            className="group bg-gradient-to-br from-white to-slate-50/80 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-sm flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Add Business
            </h3>
            <p className="text-slate-500 text-sm text-center">
              Create a new business profile
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                New Business
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-2xl transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Enter business name"
                  value={newBusiness.name}
                  onChange={(e) =>
                    setNewBusiness({ ...newBusiness, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the business"
                  value={newBusiness.description}
                  onChange={(e) =>
                    setNewBusiness({
                      ...newBusiness,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBusiness}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create Business
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
