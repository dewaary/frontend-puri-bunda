'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import api from '../../../../utils/api';

interface Position {
  id: number;
  name: string;
  created_at: string;
}

interface Unit {
  id: number;
  name: string;
  created_at: string;
}

interface Employee {
  id: number;
  name: string;
  unit: {
    id: number;
    name: string;
  };
  positions: Position[];
}

interface LoginStat {
  name: string;
  username: string;
  login_count: number;
}

interface TopUsers {
  name: string;
  username: string;
  login_count: number;
}

interface TableProps<T> {
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode }[];
  loading: boolean;
  title: string;
}

const PaginatedTable = <T,>({ data, columns, loading, title }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h3 className="text-lg mb-4">{title}</h3>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="py-2 px-4 text-left">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-2 px-4">
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <p>Total: {data.length}</p>
            <div>
              <button
                className="px-2 py-1 mx-1 bg-gray-300 rounded"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                className="px-2 py-1 mx-1 bg-gray-300 rounded"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loginStats, setLoginStats] = useState<LoginStat[]>([]);
  const [topUser, setTopUser] = useState<TopUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [positionsRes, unitsRes, employeesRes, loginStatsRes, topUsersRes] = await Promise.all([
          api.get('/positions'),
          api.get('/units'),
          api.get('/employees'),
          api.get('/login-stats'),
          api.get('/top-users')
        ]);
  
        if (positionsRes.data.status === 'success') {
          setPositions(
            positionsRes.data.data.map((position: any) => ({
              id: position.id,
              name: position.name,
              created_at: format(new Date(position.created_at), 'dd MMMM yyyy'),
            }))
          );
        }
  
        if (unitsRes.data.status === 'success') {
          setUnits(
            unitsRes.data.data.map((unit: any) => ({
              id: unit.id,
              name: unit.name,
              created_at: format(new Date(unit.created_at), 'dd MMMM yyyy'),
            }))
          );
        }
  
        if (employeesRes.data.status === 'success') {
          setEmployees(
            employeesRes.data.data.map((employee: any) => ({
              id: employee.id,
              name: employee.name,
              unit: employee.unit,
              positions: employee.positions,
            }))
          );
        }
  
        if (loginStatsRes.data.status === 'Login stats retrieved') {
          setLoginStats(loginStatsRes.data.data.login_stats);
        }

        if (topUsersRes.data.status === 'Top 10 users retrieved') {
          setTopUser(loginStatsRes.data.data.top_users);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      <PaginatedTable
        title="Employee Summary"
        data={employees}
        columns={[
          { header: 'Name', accessor: (item) => item.name },
          { header: 'Unit', accessor: (item) => item.unit.name },
          {
            header: 'Positions',
            accessor: (item) =>
              item.positions.map((pos) => pos.name).join(', ') || 'No positions assigned',
          },
        ]}
        loading={loading}
      />
      <PaginatedTable
        title="Login Statistics"
        data={loginStats}
        columns={[
          { header: 'Name', accessor: (item) => item.name },
          { header: 'Username', accessor: (item) => item.username },
          { header: 'Login Count', accessor: (item) => item.login_count },
        ]}
        loading={loading}
      />
       <PaginatedTable
        title="Top 10 User"
        data={topUser}
        columns={[
          { header: 'Name', accessor: (item) => item.name },
          { header: 'Username', accessor: (item) => item.username },
          { header: 'Login Count', accessor: (item) => item.login_count },
        ]}
        loading={loading}
      />
      <PaginatedTable
        title="Units"
        data={units}
        columns={[
          { header: 'Unit Name', accessor: (item) => item.name },
          { header: 'Created At', accessor: (item) => item.created_at },
        ]}
        loading={loading}
      />
      <PaginatedTable
        title="Positions"
        data={positions}
        columns={[
          { header: 'Position Name', accessor: (item) => item.name },
          { header: 'Created At', accessor: (item) => item.created_at },
        ]}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
