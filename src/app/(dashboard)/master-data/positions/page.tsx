'use client';

import ButtonComponent from '@/app/components/ButtonComponent';
import TableComponent from '@/app/components/TableComponent';

import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import api from '../../../../../utils/api';
import Modal from '@/app/components/ModalComponent';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const PositionsListPage: React.FC = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [newPositionName, setNewPositionName] = useState('');
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/positions');
      if (response.data.status === 'success') {
        const formattedData = response.data.data.map((position: any) => ({
          id: position.id,
          name: position.name,
          created_at: format(new Date(position.created_at), 'dd MMMM yyyy'),
        }));
        setPositions(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleAddPosition = async () => {
    try {
      const response = await api.post('/positions/add-data', { name: newPositionName });
      if (response.data.status === 'success') {
        fetchPositions();
        setIsModalOpen(false);
        setNewPositionName('');
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to add position:', error);
    }
  };

  const handleEditPosition = async () => {
    if (!editingPositionId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit a position.');
      return;
    }

    try {
      const response = await api.put(
        `/positions/update/${editingPositionId}`,
        { name: newPositionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'success') {
        fetchPositions();
        setIsModalOpen(false);
        setNewPositionName('');
        setEditingPositionId(null);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Failed to edit position:', error);
    }
  };

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Created At', field: 'created_at' },
  ];

  const handleEdit = (id: number, name: string) => {
    setEditingPositionId(id);
    setNewPositionName(name);
    setModalTitle('Edit Position');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete position: ${name}?`);
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete a position.');
        return;
      }

      try {
        const response = await api.delete(`/positions/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          fetchPositions();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to delete position:', error);
        alert('An error occurred while deleting the position.');
      }
    }
  };

  const handleAdd = () => {
    setModalTitle('Add New Position');
    setNewPositionName('');
    setIsModalOpen(true);
  };

  const tableData = positions.map((position: any) => ({
    ...position,
    onEdit: () => handleEdit(position.id, position.name),
    onDelete: () => handleDelete(position.id, position.name),
  }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <ButtonComponent text="Add Position" onClick={handleAdd} color="blue" />
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
          value={newPositionName}
          onChange={(e) => setNewPositionName(e.target.value)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPositionId(null);
          }}
          onSave={editingPositionId ? handleEditPosition : handleAddPosition}
          actionText={editingPositionId ? 'Edit' : 'Add'}
        />
      )}
    </div>
  );
};

export default PositionsListPage;
