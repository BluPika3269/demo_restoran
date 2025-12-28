'use client';

import { useState } from 'react';

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: string;
  x: number;
  y: number;
  shape: string;
}

interface TablePlanProps {
  tables: Table[];
  selectedTable: Table | null;
  onTableSelect: (table: Table) => void;
  reservedTables?: number[];
}

export default function TablePlan({ tables, selectedTable, onTableSelect, reservedTables = [] }: TablePlanProps) {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  const getTableColor = (table: Table) => {
    if (selectedTable?.id === table.id) {
      return 'fill-green-500 stroke-green-700';
    }
    if (reservedTables.includes(table.id)) {
      return 'fill-red-300 stroke-red-500 opacity-50';
    }
    if (hoveredTable === table.id) {
      return 'fill-blue-400 stroke-blue-600';
    }
    return 'fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500';
  };

  const isTableAvailable = (table: Table) => {
    return !reservedTables.includes(table.id);
  };

  const renderTable = (table: Table) => {
    const isAvailable = isTableAvailable(table);
    const cursorClass = isAvailable ? 'cursor-pointer' : 'cursor-not-allowed';

    return (
      <g
        key={table.id}
        transform={`translate(${table.x}, ${table.y})`}
        className={cursorClass}
        onMouseEnter={() => isAvailable && setHoveredTable(table.id)}
        onMouseLeave={() => setHoveredTable(null)}
        onClick={() => isAvailable && onTableSelect(table)}
      >
        {table.shape === 'circle' ? (
          <circle
            cx="40"
            cy="40"
            r="35"
            className={`${getTableColor(table)} transition-all duration-200`}
            strokeWidth="2"
          />
        ) : table.shape === 'square' ? (
          <rect
            x="5"
            y="5"
            width="70"
            height="70"
            rx="4"
            className={`${getTableColor(table)} transition-all duration-200`}
            strokeWidth="2"
          />
        ) : (
          <rect
            x="5"
            y="15"
            width="70"
            height="50"
            rx="4"
            className={`${getTableColor(table)} transition-all duration-200`}
            strokeWidth="2"
          />
        )}
        
        {/* Table number */}
        <text
          x="40"
          y="35"
          textAnchor="middle"
          className="text-xl font-bold fill-gray-700 dark:fill-gray-200"
          style={{ pointerEvents: 'none' }}
        >
          {table.number}
        </text>
        
        {/* Capacity */}
        <text
          x="40"
          y="52"
          textAnchor="middle"
          className="text-sm fill-gray-600 dark:fill-gray-300"
          style={{ pointerEvents: 'none' }}
        >
          {table.capacity} osobe
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Odaberite Stol
      </h3>
      
      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Dostupno</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border-2 border-green-700 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Odabrano</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 border-2 border-red-500 rounded opacity-50"></div>
          <span className="text-gray-700 dark:text-gray-300">Rezervirano</span>
        </div>
      </div>

      {/* Restaurant floor plan */}
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-auto bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <svg
          viewBox="0 0 800 600"
          className="w-full"
          style={{ minHeight: '400px', maxHeight: '600px' }}
        >
          {/* Background elements */}
          <rect x="0" y="0" width="800" height="600" className="fill-gray-50 dark:fill-gray-900" />
          
          {/* Entrance */}
          <rect
            x="350"
            y="0"
            width="100"
            height="20"
            className="fill-amber-500 dark:fill-amber-600"
          />
          <text
            x="400"
            y="15"
            textAnchor="middle"
            className="text-xs font-semibold fill-white"
          >
            ULAZ
          </text>

          {/* Bar area */}
          <rect
            x="650"
            y="50"
            width="130"
            height="100"
            rx="8"
            className="fill-amber-700 dark:fill-amber-800 opacity-30"
          />
          <text
            x="715"
            y="105"
            textAnchor="middle"
            className="text-lg font-bold fill-amber-900 dark:fill-amber-300"
          >
            BAR
          </text>

          {/* Kitchen area */}
          <rect
            x="20"
            y="450"
            width="150"
            height="130"
            rx="8"
            className="fill-gray-400 dark:fill-gray-700 opacity-30"
          />
          <text
            x="95"
            y="520"
            textAnchor="middle"
            className="text-lg font-bold fill-gray-700 dark:fill-gray-300"
          >
            KUHINJA
          </text>

          {/* Render all tables */}
          {tables.map(renderTable)}
        </svg>
      </div>

      {selectedTable && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-semibold">
            ✓ Odabran stol #{selectedTable.number} ({selectedTable.capacity} osobe)
          </p>
        </div>
      )}
    </div>
  );
}
