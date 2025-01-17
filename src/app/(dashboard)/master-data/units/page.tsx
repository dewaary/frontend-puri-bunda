'use client';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '@/app/components/ButtonComponent';
import TableComponent from '@/app/components/TableComponent';
import Modal from '@/app/components/ModalComponent';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import api from '../../../../../utils/api';
import { format } from 'date-fns';

const UnitListPage: React.FC = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [newUnitName, setNewUnitName] = useState('');
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/units');
      if (response.data.status === 'success') {
        const formattedData = response.data.data.map((unit: any) => ({
          id: unit.id,
          name: unit.name,
          created_at: format(new Date(unit.created_at), 'dd MMMM yyyy'),
        }));
        setUnits(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleAddUnit = async () => {
    try {
      const response = await api.post('/units/add-data', { name: newUnitName });
      if (response.data.status === 'success') {
        fetchUnits();
        setIsModalOpen(false);
        setNewUnitName('');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to add unit:', error);
    }
  };

  const handleEditUnit = async () => {
    if (!editingUnitId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit a unit.');
      return;
    }

    try {
      const response = await api.put(
        `/units/update/${editingUnitId}`,
        { name: newUnitName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'success') {
        fetchUnits();
        setIsModalOpen(false);
        setNewUnitName('');
        setEditingUnitId(null);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to edit unit:', error);
    }
  };

  const handleDeleteUnit = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete unit: ${name}?`);
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete a unit.');
        return;
      }

      try {
        const response = await api.delete(`/units/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          fetchUnits();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to delete unit:', error);
        alert('An error occurred while deleting the unit.');
      }
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingUnitId(id);
    setNewUnitName(name);
    setModalTitle('Edit Unit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setModalTitle('Add New Unit');
    setNewUnitName('');
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Created At', field: 'created_at' },
  ];

  const tableData = units.map((unit: any) => ({
    ...unit,
    onEdit: () => handleEdit(unit.id, unit.name),
    onDelete: () => handleDeleteUnit(unit.id, unit.name),
  }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <ButtonComponent text="Add Unit" onClick={handleAdd} color="blue" />
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
          value={newUnitName}
          onChange={(e) => setNewUnitName(e.target.value)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUnitId(null);
          }}
          onSave={editingUnitId ? handleEditUnit : handleAddUnit}
          actionText={editingUnitId ? 'Edit' : 'Add'}
        />
      )}
    </div>
  );
};

export default UnitListPage;
