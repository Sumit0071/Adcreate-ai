"use client";

import { useState } from "react";
import { Building2, Tags, Package, Users, Target } from "lucide-react";

export const BusinessProfileCard:React.FC<{}> =()=>{
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    productService: "",
    targetAudience: "",
    adGoal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Business Profile created successfully!");
        setFormData({
          businessName: "",
          niche: "",
          productService: "",
          targetAudience: "",
          adGoal: "",
        });
      } else {
        alert("❌ Error creating profile.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <div className="min-h-[700px] bg-gradient-to-br from-gray-100 via-white to-gray-100 ">
      <main className="p-6 flex justify-center mt-15">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl space-y-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Create Business Profile
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 - Business Info */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Business Information
              </h2>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <Building2 className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="e.g., Acme Corp"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full p-3 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niche
                </label>
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <Tags className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="niche"
                    placeholder="e.g., Fitness, Tech, Fashion"
                    value={formData.niche}
                    onChange={handleChange}
                    className="w-full p-3 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2 - Marketing Info */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Marketing Information
              </h2>

              {/* Product / Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product / Service
                </label>
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <Package className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="productService"
                    placeholder="e.g., Online Coaching, App Development"
                    value={formData.productService}
                    onChange={handleChange}
                    className="w-full p-3 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <div className="flex items-start border rounded-lg px-3 bg-white">
                  <Users className="text-gray-400 mr-2 mt-3" size={18} />
                  <textarea
                    name="targetAudience"
                    placeholder="e.g., Young professionals, Small business owners"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="w-full p-3 outline-none"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Ad Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Goal
                </label>
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <Target className="text-gray-400 mr-2" size={18} />
                  <select
                    name="adGoal"
                    value={formData.adGoal}
                    onChange={handleChange}
                    className="w-full p-3 outline-none bg-transparent"
                    required
                  >
                    <option value="">Select an Ad Goal</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold transition transform ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] shadow-md"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}
