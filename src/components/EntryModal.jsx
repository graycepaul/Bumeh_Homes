"use client";

import { useState, useEffect } from "react";

export default function AddLogModal({
  show,
  onClose,
  onAddLog,
  trips: initialTrips = 1,
}) {
  // Fixed transport costs and product prices (in Naira)
  const TRANSPORT_COST = { Idu: 40000, Aviation: 70000 };
  const PRODUCT_PRICES = {
    Dust: 12000,
    "3/8": 12000,
    "3/4": 11000,
  };

  const [trips, setTrips] = useState(initialTrips);
  const [newLog, setNewLog] = useState({
    date: "",
    location: "Idu",
    trips: trips,
    customer: "",
    products: [{ name: "Dust", tonnagePerTrip: Array(trips).fill(0) }],
    paymentStatus: "Pending",
  });

  useEffect(() => {
    // Adjust tonnagePerTrip arrays when trips changes
    const updatedProducts = newLog.products.map((p) => ({
      ...p,
      tonnagePerTrip:
        p.tonnagePerTrip.length === trips
          ? p.tonnagePerTrip
          : Array(trips).fill(0),
    }));
    setNewLog((prev) => ({ ...prev, trips, products: updatedProducts }));
  }, [trips]);

  const handleAddProduct = () => {
    setNewLog({
      ...newLog,
      products: [
        ...newLog.products,
        { name: "Dust", tonnagePerTrip: Array(trips).fill(0) },
      ],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...newLog.products];
    updatedProducts.splice(index, 1);
    setNewLog({ ...newLog, products: updatedProducts });
  };

  // Calculate product total: sum of all tons × price per ton
  const calculateProductTotal = (product) => {
    const totalTons = product.tonnagePerTrip.reduce(
      (sum, tons) => sum + tons,
      0
    );
    return totalTons * PRODUCT_PRICES[product.name];
  };

  // Calculate transport total: number of trips × fixed transport cost
  const calculateTransportTotal = () => trips * TRANSPORT_COST[newLog.location];

  // Grand total: (sum of all products total) + transport total
  const calculateGrandTotal = () =>
    newLog.products.reduce((sum, p) => sum + calculateProductTotal(p), 0) +
    calculateTransportTotal();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  const getTotalTonnageForProduct = (product) =>
    product.tonnagePerTrip.reduce((sum, tons) => sum + tons, 0);

  const getTotalTonnage = () =>
    newLog.products.reduce(
      (sum, product) => sum + getTotalTonnageForProduct(product),
      0
    );

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              New Delivery Log
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Add customer delivery information
            </p>
          </div>
          <button
            onClick={onClose}
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

        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="flex flex-col sm:flex-row w-full gap-4 justify-between">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) =>
                    setNewLog({ ...newLog, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newLog.customer}
                  onChange={(e) =>
                    setNewLog({ ...newLog, customer: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                  placeholder="Enter customer name"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col sm:flex-row w-full gap-4 justify-between">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <select
                  value={newLog.location}
                  onChange={(e) =>
                    setNewLog({ ...newLog, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option value="Idu">
                    Idu - {formatCurrency(TRANSPORT_COST.Idu)} per trip
                  </option>
                  <option value="Aviation">
                    Aviation - {formatCurrency(TRANSPORT_COST.Aviation)} per
                    trip
                  </option>
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trips *
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={trips}
                  onChange={(e) =>
                    setTrips(Math.max(1, Math.min(50, Number(e.target.value))))
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={newLog.paymentStatus}
                  onChange={(e) =>
                    setNewLog({ ...newLog, paymentStatus: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex justify-between items-start sm:items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Products
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Add products and tonnage for each trip
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors duration-200 font-medium min-w-fit"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Product
              </button>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {newLog.products.map((product, productIndex) => (
                <div
                  key={productIndex}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:border-slate-300 transition-colors duration-200"
                >
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <select
                      value={product.name}
                      onChange={(e) => {
                        const updatedProducts = [...newLog.products];
                        updatedProducts[productIndex].name = e.target.value;
                        setNewLog({ ...newLog, products: updatedProducts });
                      }}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium"
                    >
                      {Object.keys(PRODUCT_PRICES).map((name) => (
                        <option key={name} value={name}>
                          {name} - {formatCurrency(PRODUCT_PRICES[name])}/ton
                        </option>
                      ))}
                    </select>

                    <div className="text-sm text-slate-600">
                      <span className="font-medium">
                        {getTotalTonnageForProduct(product).toFixed(2)}t
                      </span>{" "}
                      total
                    </div>

                    <div className="text-sm font-medium text-emerald-600">
                      {formatCurrency(calculateProductTotal(product))}
                    </div>

                    {newLog.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(productIndex)}
                        className="ml-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Trip Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {product.tonnagePerTrip.map((tonnage, tripIndex) => (
                      <div key={tripIndex}>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Trip {tripIndex + 1} (tons)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={tonnage}
                          onChange={(e) => {
                            const updatedProducts = [...newLog.products];
                            updatedProducts[productIndex].tonnagePerTrip[
                              tripIndex
                            ] = Number(e.target.value);
                            setNewLog({
                              ...newLog,
                              products: updatedProducts,
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Total Trips
                </div>
                <div className="text-md sm:text-2xl font-bold text-slate-900">
                  {trips}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Total Tonnage
                </div>
                <div className="text-md sm:text-2xl font-bold text-slate-900">
                  {getTotalTonnage().toFixed(2)}t
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-sm font-medium text-blue-600 mb-1">
                  Transport Cost
                </div>
                <div className="text-md sm:text-2xl font-bold text-blue-900">
                  {formatCurrency(calculateTransportTotal())}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4">
                <div className="text-sm font-medium text-emerald-600 mb-1">
                  Products Total
                </div>
                <div className="text-md sm:text-2xl font-bold text-emerald-900">
                  {formatCurrency(
                    newLog.products.reduce(
                      (sum, p) => sum + calculateProductTotal(p),
                      0
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-center">
              <div className="text-sm font-medium text-slate-300 mb-1">
                Grand Total
              </div>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(calculateGrandTotal())}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Products:{" "}
                {formatCurrency(
                  newLog.products.reduce(
                    (sum, p) => sum + calculateProductTotal(p),
                    0
                  )
                )}
                + Transport: {formatCurrency(calculateTransportTotal())}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50/50 sticky bottom-0 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              Required fields are marked with *
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                onClick={() => onAddLog(newLog)}
                disabled={!newLog.date || !newLog.customer}
                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Delivery Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
