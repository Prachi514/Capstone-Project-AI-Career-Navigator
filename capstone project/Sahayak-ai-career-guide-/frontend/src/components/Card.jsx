import React from 'react';

export default function Card({ title, value, children }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
      </div>
      {children && <p className="text-sm text-gray-500 mt-3">{children}</p>}
    </div>
  );
}
