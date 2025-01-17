
import React from 'react';

type TableColumn = {
  title: string;
  field: string;
};

type TableRow = {
  id: string | number;
  [key: string]: string | number;
  onEdit?: (name: string) => void;
  onDelete?: (name: string) => void;
};

type TableComponentProps = {
  columns: TableColumn[];
  data: TableRow[];
};

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  return (
    <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col) => (
            <th key={col.field} className="px-4 py-2 text-left">{col.title}</th>
          ))}
          <th className="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
          >
            {columns.map((col) => (
              <td key={col.field} className="px-4 py-2">{row[col.field]}</td>
            ))}
            <td className="px-4 py-2 flex gap-2">
              {row.onEdit && (
                <button
                  onClick={() => row.onEdit(row.name)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
              )}
              {row.onDelete && (
                <button
                  onClick={() => row.onDelete(row.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default TableComponent;
