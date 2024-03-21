import { err, ok } from 'neverthrow';
import React, { useMemo, useState } from 'react';

import Navbar from './components/shared/Navbar';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';




export default function App() {
  return (
    <div className='!bg-gray-200 min-h-screen'>
      <Navbar />
      <div className='max-w-screen p-4 flex justify-center'>


        <RouterProvider router={routes} />
       

      </div>

    </div>
  );
}
