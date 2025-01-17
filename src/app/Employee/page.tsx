"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import Modal from "../components/ModalComponent";
import { toast } from "react-toastify";

type EmployeeFormData = {
  name: string;
  username: string;
  password: string;
  unit: { value: string; label: string } | null;
  position: MultiValue<{ value: string; label: string }>;
};

const EmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    username: "",
    password: "",
    unit: null,
    position: [],
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<EmployeeFormData>>({});

  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [positionOptions, setPositionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [modalOpen, setModalOpen] = useState<"unit" | "position" | null>(null);
  const [newUnit, setNewUnit] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const router = useRouter();

  const fetchUnits = async () => {
    try {
      const response = await api.get("/units");
      const { data } = response.data;
      const formattedUnits = data.map((unit: any) => ({
        value: unit.id.toString(),
        label: unit.name,
      }));
      setUnitOptions(formattedUnits);
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to fetch units. Please try again.");
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get("/positions");
      const { data } = response.data;
      const formattedPositions = data.map((position: any) => ({
        value: position.id.toString(),
        label: position.name,
      }));
      setPositionOptions(formattedPositions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("Failed to fetch positions. Please try again.");
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchPositions();
  }, []);

  const handleUnitChange = (
    selected: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, unit: selected }));
  };

  const handlePositionChange = (
    selected: MultiValue<{ value: string; label: string }>
  ) => {
    setFormData((prev) => ({ ...prev, position: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        unit_id: formData.unit?.value,
        position_ids:
          formData.position.length > 0
            ? formData.position.map((pos) => parseInt(pos.value))
            : [],
      };

      const response = await api.post("/employees/add-data", payload);

      console.log("isi response", response)

      if (response.data.status === "success") {
        toast.success("Form submitted successfully!");
        console.log("Form submitted successfully:", response.data);
        router.push("/Login");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        toast.error(
          error.response.data?.message ||
            "An error occurred. Please try again later."
        );
      } else {
        console.error("Error submitting form:", error);
        toast.error("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async () => {
    if (newUnit) {
      try {
        const response = await api.post("/units/add-data", { name: newUnit });
        if (response.data.status === "success") {
          const newUnitOption = { value: newUnit, label: newUnit };
          setUnitOptions((prevOptions) => [...prevOptions, newUnitOption]);
          setFormData((prev) => ({ ...prev, unit: newUnitOption }));
          setNewUnit("");
          setModalOpen(null);
          toast.success("Unit added successfully!");
        } else {
          console.error("Failed to add unit:", response);
          toast.error("Failed to add unit. Please try again.");
        }
      } catch (error) {
        console.error("Error adding unit:", error);
        toast.error("An error occurred while adding the unit.");
      }
    }
  };

  const handleAddPosition = async () => {
    if (newPosition) {
      try {
        const response = await api.post("/positions/add-data", {
          name: newPosition,
        });
        if (response.data.status === "success") {
          const newPositionOption = { value: newPosition, label: newPosition };
          setPositionOptions((prevOptions) => [
            ...prevOptions,
            newPositionOption,
          ]);
          setFormData((prev) => ({
            ...prev,
            position: [...prev.position, newPositionOption],
          }));
          setNewPosition("");
          setModalOpen(null);
          toast.success("Position added successfully!");
        } else {
          console.error("Failed to add position:", response);
          toast.error("Failed to add position. Please try again.");
        }
      } catch (error) {
        console.error("Error adding position:", error);
        toast.error("An error occurred while adding the position.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-xl w-full p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Karyawan</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nama</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan nama"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Unit</label>
            <Select
              options={unitOptions}
              value={formData.unit}
              onChange={handleUnitChange}
              isClearable
              placeholder="Pilih unit"
              className="basic-single"
              classNamePrefix="select"
            />
            <button
              type="button"
              className="mt-2 text-blue-500 text-sm"
              onClick={() => setModalOpen("unit")}
            >
              Add Unit
            </button>
            {errors.unit && (
              <p className="text-red-500 text-sm">
                {typeof errors.unit === "string"
                  ? errors.unit
                  : errors.unit?.label}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Jabatan</label>
            <Select
              options={positionOptions}
              value={formData.position}
              onChange={handlePositionChange}
              isMulti
              placeholder="Pilih jabatan"
              className="basic-multi-select"
              classNamePrefix="select"
            />
            <button
              type="button"
              className="mt-2 text-blue-500 text-sm"
              onClick={() => setModalOpen("position")}
            >
              Add Jabatan
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                role="status"
                className="w-6 h-6 text-white animate-spin"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  d="M 10 50 C 10 50 20 40 30 40 C 40 40 50 50 50 50 C 50 50 60 40 70 40 C 80 40 90 50 90 50 C 90 50 80 60 70 60 C 60 60 50 50 50 50 C 50 50 40 60 30 60 C 20 60 10 50 10 50 Z"
                />
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        {modalOpen === "unit" && (
          <Modal
            title="Add Unit"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            onClose={() => setModalOpen(null)}
            onSave={handleAddUnit}
          />
        )}
        {modalOpen === "position" && (
          <Modal
            title="Add Jabatan"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
            onClose={() => setModalOpen(null)}
            onSave={handleAddPosition}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
