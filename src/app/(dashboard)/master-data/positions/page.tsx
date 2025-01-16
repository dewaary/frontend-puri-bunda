// pages/PositionsListPage.tsx
'use client';

import ButtonComponent from '@/app/components/ButtonComponent';
import TableComponent from '@/app/components/TableComponent';
import React, { useState } from 'react';

const PositionsListPage: React.FC = () => {
  // Dummy data
  const [positions, setPositions] = useState([
    { name: 'Position 1', created_at: '2025-01-01' },
    { name: 'Position 2', created_at: '2025-01-02' },
    { name: 'Position 3', created_at: '2025-01-03' },
    { name: 'Position 4', created_at: '2025-01-04' },
    { name: 'Position 5', created_at: '2025-01-05' },
    { name: 'Position 6', created_at: '2025-01-06' },
    { name: 'Position 7', created_at: '2025-01-07' },
    { name: 'Position 8', created_at: '2025-01-08' },
    { name: 'Position 9', created_at: '2025-01-09' },
    { name: 'Position 10', created_at: '2025-01-10' },
  ]);

  // Columns for the table
  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Created At', field: 'created_at' },
  ];

  // Handle actions (Edit and Delete)
  const handleEdit = (name: string) => {
    alert(`Edit ${name}`);
  };

  const handleDelete = (name: string) => {
    alert(`Delete ${name}`);
  };

  const handleAdd = () => {
    alert('Add New Position');
    // Logika untuk menambahkan data baru
  };

  const tableData = positions.map((position) => ({
    ...position,
    onEdit: handleEdit,
    onDelete: handleDelete,
  }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <ButtonComponent text="Add Position" onClick={handleAdd} color="blue" />
      </div>
      <TableComponent columns={columns} data={tableData} />
    </div>
  );
};

export default PositionsListPage;
