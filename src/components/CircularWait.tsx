import React from 'react';

export default function CircularWait({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
}
