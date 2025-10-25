"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AddLogModal from "@/components/EntryModal";

export default function BusinessPage() {
  const { id } = useParams();

  const TRANSPORT_COST = { Idu: 40000, Aviation: 80000 };
  const PRODUCT_PRICES = { Dust: 12000, "3/8": 12000, "3/4": 11000 };

  const [logs, setLogs] = useState([
    {
      id: 1,
      date: "2025-10-24",
      location: "Idu",
      customer: "John Doe",
      products: [{ name: "3/8", tonnagePerTrip: [10, 12] }],
      trips: 2,
      paymentStatus: "Paid",
    },
    {
      id: 2,
      date: "2025-10-23",
      location: "Aviation",
      customer: "Jane Smith",
      products: [{ name: "Dust", tonnagePerTrip: [15, 20] }],
      trips: 2,
      paymentStatus: "Pending",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterPayment, setFilterPayment] = useState("");

  const calculateProductTotal = (product) =>
    product.tonnagePerTrip.reduce(
      (sum, tons) => sum + tons * PRODUCT_PRICES[product.name],
      0
    );

  const calculateTransportTotal = (log) =>
    log.trips * TRANSPORT_COST[log.location];

  const calculateGrandTotal = (log) =>
    log.products.reduce((sum, p) => sum + calculateProductTotal(p), 0) +
    calculateTransportTotal(log);

  const handleAddLog = (newLog) => {
    const nextId = logs.length ? Math.max(...logs.map((l) => l.id)) + 1 : 1;
    setLogs([...logs, { id: nextId, ...newLog }]);
    setShowModal(false);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const monthMatch = new Date(log.date).getMonth() + 1 === selectedMonth;
    const customerMatch = filterCustomer
      ? log.customer.toLowerCase().includes(filterCustomer.toLowerCase())
      : true;
    const paymentMatch = filterPayment
      ? log.paymentStatus === filterPayment
      : true;
    return monthMatch && customerMatch && paymentMatch;
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getTotalRevenue = () =>
    filteredLogs.reduce((sum, log) => sum + calculateGrandTotal(log), 0);

  const getTotalLogs = filteredLogs.length;
  const getPaidLogs = filteredLogs.filter(
    (log) => log.paymentStatus === "Paid"
  ).length;

  const getPendingLogs = filteredLogs.filter(
    (log) => log.paymentStatus === "Pending"
  ).length;

  const getPaidAmount = () =>
    filteredLogs
      .filter((log) => log.paymentStatus === "Paid")
      .reduce((sum, log) => sum + calculateGrandTotal(log), 0);

  const getPendingAmount = () =>
    filteredLogs
      .filter((log) => log.paymentStatus === "Pending")
      .reduce((sum, log) => sum + calculateGrandTotal(log), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-white/50 rounded-2xl transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900">
                Quarry
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-lg ml-12">
              Delivery Logs & Analytics
            </p>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-200 ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              Filters
              {showFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white">
            <div className="text-sm font-medium text-slate-300 mb-2">
              Total Revenue
            </div>
            <div className="text-md sm:text-2xl font-bold">
              {formatCurrency(getTotalRevenue())}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {getTotalLogs} log entries
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600 mb-2">Logs</div>
            <div className="text-md text-2xl font-bold text-slate-900">
              {getTotalLogs}
            </div>
            <div className="text-xs text-slate-500 mt-2">This month</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-200">
            <div className="text-sm font-medium mb-2">Paid Invoices</div>
            <div className="text-md sm:text-2xl font-bold text-emerald-600 mb-1">
              {formatCurrency(getPaidAmount())}
            </div>
            <div className="text-xs text-emerald-600">
              {getPaidLogs} paid invoices
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {getTotalLogs > 0
                ? Math.round((getPaidLogs / getTotalLogs) * 100)
                : 0}
              % paid
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-200 ">
            <div className="text-sm font-medium mb-2 truncate">
              Pending Payments
            </div>
            <div className="text-md sm:text-2xl font-bold text-orange-600 mb-1">
              {formatCurrency(getPendingAmount())}
            </div>
            <div className="text-xs text-amber-600">
              {getPendingLogs} unpaid invoices
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {getTotalLogs > 0
                ? Math.round((getPendingLogs / getTotalLogs) * 100)
                : 0}
              % pending
            </div>
          </div>
        </div>

        {/* Hidden Filters Panel */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 mb-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Filter Logs
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer
                </label>
                <input
                  type="text"
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  placeholder="Search customers..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                >
                  <option value="">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs Grid with Add Card */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Add New Log Card */}
          <div
            onClick={() => setShowModal(true)}
            className="group bg-gradient-to-br from-white to-slate-50/80 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-sm flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="w-16 h-16 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-300"
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
            <h3 className="text-lg font-semibold text-slate-700 mb-2 text-center">
              New Delivery Log
            </h3>
            <p className="text-slate-500 text-sm text-center">
              Create a new customer delivery entry
            </p>
          </div>

          {/* Log Entries */}
          {filteredLogs.map((log) => {
            const productTotal = log.products.reduce(
              (sum, p) =>
                sum +
                p.tonnagePerTrip.reduce((a, b) => a + b, 0) *
                  PRODUCT_PRICES[p.name],
              0
            );
            const transportTotal = calculateTransportTotal(log);
            const grandTotal = productTotal + transportTotal;

            return (
              <div
                key={log.id}
                className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-500 border border-white/50 hover:border-white/80"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-800">
                      {log.customer}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(log.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {log.location}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {log.paymentStatus}
                  </span>
                </div>
                {/* Compact Delivery Summary */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    DELIVERY SUMMARY
                  </h4>
                </div>
                <div className="flex w-full justify-between gap-4 mb-4">
                  <div className="space-y-3 w-full">
                    {log.products.map((p, i) => {
                      const totalTons = p.tonnagePerTrip.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const productTrips = p.tonnagePerTrip.filter(
                        (ton) => ton > 0
                      ).length;

                      return (
                        <div
                          key={i}
                          className="border border-slate-200 rounded-xl p-3"
                        >
                          <div className="flex  flex-col gap-4 text-sm">
                            <div className="flex justify-between items-center">
                              <div className="text-slate-500 text-sm mb-1">
                                Product
                              </div>
                              <div className="font-medium">{p.name}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-slate-500 text-sm mb-1">
                                Trips
                              </div>
                              <div className="font-medium">{productTrips}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-slate-500 text-sm mb-1">
                                Tonnage
                              </div>
                              <div className="font-medium">
                                {totalTons.toFixed(1)}t
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                Products Total:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  log.products.reduce((sum, p) => {
                                    const totalTons = p.tonnagePerTrip.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    return (
                                      sum + totalTons * PRODUCT_PRICES[p.name]
                                    );
                                  }, 0)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Transport:</span>
                              <span className="font-medium">
                                <span className="font-medium">
                                  {formatCurrency(
                                    log.trips * TRANSPORT_COST[log.location]
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Totals Section */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      GRAND TOTAL
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AddLogModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddLog={handleAddLog}
      />
    </div>
  );
}
