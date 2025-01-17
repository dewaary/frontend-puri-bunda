'use client';

import ButtonComponent from '@/app/components/ButtonComponent';
import TableComponent from '@/app/components/TableComponent';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';



import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import api from '../../../../utils/api';
import Modal from '@/app/components/ModalComponent';

type EmployeeFormData = {
  name: string;
  username: string;
  password: string;
  unit: { value: string; label: string } | null;
  position: MultiValue<{ value: string; label: string }>;
};

const EmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeUsername, setNewEmployeeUsername] = useState('');
  const [newEmployeeUnit, setNewEmployeeUnit] = useState('');
  const [newEmployeePositions, setNewEmployeePositions] = useState<string[]>([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      if (response.data.status === 'success') {
        const formattedData = response.data.data.map((employee: any) => ({
          id: employee.id,
          name: employee.name,
          username: employee.username,
          unit: employee.unit.name,
          positions: employee.positions.map((pos: any) => pos.name).join(', '),
          joined_at: format(new Date(employee.joined_at), 'dd MMMM yyyy'),
        }));
        setEmployees(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await api.post('/employees/add-data', {
        name: newEmployeeName,
        username: newEmployeeUsername,
        unit: newEmployeeUnit,
        positions: newEmployeePositions,
      });
      if (response.data.status === 'success') {
        fetchEmployees();
        setIsModalOpen(false);
        setNewEmployeeName('');
        setNewEmployeeUsername('');
        setNewEmployeeUnit('');
        setNewEmployeePositions([]);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleEditEmployee = async () => {
    if (!editingEmployeeId) return;

    try {
      const response = await api.put(`/employees/update/${editingEmployeeId}`, {
        name: newEmployeeName,
        username: newEmployeeUsername,
        unit: newEmployeeUnit,
        positions: newEmployeePositions,
      });
      if (response.data.status === 'success') {
        fetchEmployees();
        setIsModalOpen(false);
        setNewEmployeeName('');
        setNewEmployeeUsername('');
        setNewEmployeeUnit('');
        setNewEmployeePositions([]);
        setEditingEmployeeId(null);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to edit employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete employee: ${name}?`);
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete an employee.');
        return;
      }

      try {
        const response = await api.delete(`/employees/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          fetchEmployees();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('An error occurred while deleting the employee.');
      }
    }
  };

  const handleEdit = (id: number, name: string, username: string, unit: string, positions: string[]) => {
    setEditingEmployeeId(id);
    setNewEmployeeName(name);
    setNewEmployeeUsername(username);
    setNewEmployeeUnit(unit);
    setNewEmployeePositions(positions);
    setModalTitle('Edit Employee');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setModalTitle('Add New Employee');
    setNewEmployeeName('');
    setNewEmployeeUsername('');
    setNewEmployeeUnit('');
    setNewEmployeePositions([]);
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Username', field: 'username' },
    { title: 'Unit', field: 'unit' },
    { title: 'Positions', field: 'positions' },
    { title: 'Joined At', field: 'joined_at' },
    {
      title: 'Actions',
      render: (rowData: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(rowData.id, rowData.name, rowData.username, rowData.unit, rowData.positions)} className="text-blue-500">Edit</button>
          <button onClick={() => handleDeleteEmployee(rowData.id, rowData.name)} className="text-red-500">Delete</button>
        </div>
      ),
    },
  ];

  const tableData = employees.map((employee: any) => ({
    ...employee,
    onEdit: () => handleEdit(employee.id, employee.name, employee.username, employee.unit, employee.positions.split(', ')),
    onDelete: () => handleDeleteEmployee(employee.id, employee.name),
  }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <ButtonComponent text="Add Employee" onClick={handleAdd} color="blue" />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        <TableComponent columns={columns} data={tableData} />
      )}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          onClose={() => setIsModalOpen(false)}
          onSave={editingEmployeeId ? handleEditEmployee : handleAddEmployee}
          actionText={editingEmployeeId ? 'Edit' : 'Add'}
        >
          <input
            type="text"
            placeholder="Username"
            value={newEmployeeUsername}
            onChange={(e) => setNewEmployeeUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Unit"
            value={newEmployeeUnit}
            onChange={(e) => setNewEmployeeUnit(e.target.value)}
          />
          <input
            type="text"
            placeholder="Positions (comma separated)"
            value={newEmployeePositions.join(', ')}
            onChange={(e) => setNewEmployeePositions(e.target.value.split(', '))}
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeesListPage;
