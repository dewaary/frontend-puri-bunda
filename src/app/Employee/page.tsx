"use client"

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { useRouter } from "next/navigation";

type EmployeeFormData = {
  name: string;
  username: string;
  password: string;
  unit: { value: string; label: string } | null;
  position: MultiValue<{ value: string; label: string }>;
  joinDate: string;
};

const EmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    username: "",
    password: "",
    unit: null,
    position: [],
    joinDate: "",
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  
  // State untuk unit dan position options
  const [unitOptions, setUnitOptions] = useState([
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" },
  ]);
  
  const [positionOptions, setPositionOptions] = useState([
    { value: "Manager", label: "Manager" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Staff", label: "Staff" },
    { value: "Intern", label: "Intern" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [isAddingUnit, setIsAddingUnit] = useState(true); // Track whether we are adding unit or position
  const router = useRouter();


  const handleUnitChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData((prev) => ({ ...prev, unit: selectedOption }));
  };

  const handlePositionChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setFormData((prev) => ({ ...prev, position: newValue }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate and submit your form
    if (formData) {
      console.log("Form submitted");
      // navigate to login page
      router.push("/Login");
    }
  };

  const handleAddUnit = () => {
    if (newUnit) {
      const newUnitOption = { value: newUnit, label: newUnit };
      setUnitOptions((prevOptions) => [...prevOptions, newUnitOption]);
      setFormData((prev) => ({ ...prev, unit: newUnitOption }));
      setNewUnit("");
      setModalOpen(false);
    }
  };

  const handleAddPosition = () => {
    if (newPosition) {
      const newPositionOption = { value: newPosition, label: newPosition };
      setPositionOptions((prevOptions) => [...prevOptions, newPositionOption]);
      setFormData((prev) => ({
        ...prev,
        position: [...prev.position, newPositionOption],
      }));
      setNewPosition("");
      setModalOpen(false);
    }
  };

  const openModalForUnit = () => {
    setIsAddingUnit(true); // Set state to indicate we are adding a unit
    setModalOpen(true); // Open the modal
  };

  const openModalForPosition = () => {
    setIsAddingUnit(false); // Set state to indicate we are adding a position
    setModalOpen(true); // Open the modal
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-xl w-full p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Form Karyawan</h1>
        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nama</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan nama"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
  
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
  
          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
  
          {/* Unit */}
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
              onClick={openModalForUnit} // Open the modal for adding a unit
            >
              Add Unit
            </button>
            {errors.unit && <p className="text-red-500 text-sm">{typeof errors.unit === 'string' ? errors.unit : errors.unit?.label}</p>}
          </div>
  
          {/* Jabatan */}
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
              onClick={openModalForPosition} // Open the modal for adding a position
            >
              Add Jabatan
            </button>
          </div>
  
          {/* Tanggal Bergabung */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tanggal Bergabung</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.joinDate && <p className="text-red-500 text-sm">{errors.joinDate}</p>}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
  
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-96">
              <h2 className="text-lg font-bold mb-4">Add Unit / Jabatan</h2>
              <input
                type="text"
                value={isAddingUnit ? newUnit : newPosition}
                onChange={(e) =>
                  isAddingUnit
                    ? setNewUnit(e.target.value)
                    : setNewPosition(e.target.value)
                }
                placeholder="Enter new name"
                className="w-full px-3 py-2 border rounded-md mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={isAddingUnit ? handleAddUnit : handleAddPosition}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default EmployeeForm;
