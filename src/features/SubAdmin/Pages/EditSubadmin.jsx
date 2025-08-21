import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateSubadmin } from "../api";
import { toast, Toaster } from "sonner";
import { Shield, Eye, EyeOff, ChevronDown, Check, Save, ArrowLeft, X } from "lucide-react";

const EditSubadmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); 

  const subadmin = state?.subadmin || {}; 

  const [name, setName] = useState(subadmin.name || "");
  const [email, setEmail] = useState(subadmin.email || "");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState(subadmin.permissions || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dashboardSections = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "stocks", label: "Stocks" },
    { id: "customers", label: "Customers" },
  ];

  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      return toast.error("Name and email are required");
    }

    const payload = {
      name,
      email,
      permissions,
      role: "subadmin",
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    try {
      setIsSubmitting(true);
      await updateSubadmin(payload, id);
      toast.success("Subadmin updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update subadmin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Subadmin</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 border rounded"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (optional)"
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex justify-between items-center border px-3 py-2 rounded"
          >
            <span>
              {permissions.length > 0
                ? `${permissions.length} selected`
                : "Select Permissions"}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="border rounded mt-1">
              {dashboardSections.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between px-3 py-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePermission(s.id)}
                >
                  <span>{s.label}</span>
                  {permissions.includes(s.id) && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          )}

          {permissions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {permissions.map((p) => {
                const section = dashboardSections.find((s) => s.id === p);
                return (
                  <span
                    key={p}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {section?.label}
                    <X
                      size={14}
                      onClick={() => togglePermission(p)}
                      className="cursor-pointer"
                    />
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default EditSubadmin;
