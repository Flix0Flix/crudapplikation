'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Car {
  id: number;
  title: string;
  description: string;
  year: number;
  driven: number;
  registration: string;
  created_at: string;
}

export default function CarManagement() {
  const [activeView, setActiveView] = useState<'list' | 'add' | 'update' | 'delete'>('list');
  const [carData, setCarData] = useState({
    id: '',
    title: '',
    description: '',
    year: '',
    driven: '',
    registration: ''
  });
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    if (activeView === 'list') {
      fetchCars();
    }
  }, [activeView]);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...carData,
          year: carData.year ? parseInt(carData.year) : null,
          driven: carData.driven ? parseInt(carData.driven) : null
        }),
      });
      
      if (response.ok) {
        resetForm();
        setActiveView('list');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(carData.id),
          title: carData.title,
          description: carData.description,
          year: carData.year ? parseInt(carData.year) : null,
          driven: carData.driven ? parseInt(carData.driven) : null,
          registration: carData.registration
        }),
      });
      
      if (response.ok) {
        resetForm();
        setActiveView('list');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(carData.id)
        }),
      });
      
      if (response.ok) {
        resetForm();
        setActiveView('list');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setCarData({
      id: '',
      title: '',
      description: '',
      year: '',
      driven: '',
      registration: ''
    });
  };

  return (
    <div className="p-4">
      <nav className="bg-gray-200 p-4 mb-4">
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setActiveView('list')}
            className="px-3 py-1 bg-white rounded border"
          >
            Car List
          </button>
          <button 
            onClick={() => {
              resetForm();
              setActiveView('add');
            }}
            className="px-3 py-1 bg-white rounded border"
          >
            Add Car
          </button>
          <button 
            onClick={() => {
              resetForm();
              setActiveView('update');
            }}
            className="px-3 py-1 bg-white rounded border"
          >
            Update Car
          </button>
          <button 
            onClick={() => {
              resetForm();
              setActiveView('delete');
            }}
            className="px-3 py-1 bg-white rounded border"
          >
            Delete Car
          </button>
          <h1 className="p-2 flex-grow">Car Application</h1>
        </div>
      </nav>

      {activeView === 'list' && (
        <div className="bg-white p-6 rounded border">
          <h1 className="text-xl mb-4">Car List</h1>
          {cars.length === 0 ? (
            <p>No cars found. Add a car to get started.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">ID</th>
                  <th className="p-2 border text-left">Title</th>
                  <th className="p-2 border text-left">Year</th>
                  <th className="p-2 border text-left">Miles/KMs</th>
                  <th className="p-2 border text-left">Registration</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border">
                    <td className="p-2 border">{car.id}</td>
                    <td className="p-2 border">{car.title}</td>
                    <td className="p-2 border">{car.year}</td>
                    <td className="p-2 border">{car.driven}</td>
                    <td className="p-2 border">{car.registration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeView === 'add' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded border">
          <h1 className="text-xl mb-4">Add New Car</h1>
          <form onSubmit={handleAddSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={carData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Year*</label>
                <input
                  type="number"
                  name="year"
                  value={carData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Miles/KMs</label>
                <input
                  type="number"
                  name="driven"
                  value={carData.driven}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Registration</label>
              <input
                type="text"
                name="registration"
                value={carData.registration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Add Car
            </button>
          </form>
        </div>
      )}

      {activeView === 'update' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded border">
          <h1 className="text-xl mb-4">Update Car</h1>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Car ID*</label>
              <input
                type="number"
                name="id"
                value={carData.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="Enter car ID to update"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={carData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Year*</label>
                <input
                  type="number"
                  name="year"
                  value={carData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Miles/KMs</label>
                <input
                  type="number"
                  name="driven"
                  value={carData.driven}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Registration</label>
              <input
                type="text"
                name="registration"
                value={carData.registration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Update Car
            </button>
          </form>
        </div>
      )}

      {activeView === 'delete' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded border">
          <h1 className="text-xl mb-4">Delete Car</h1>
          <form onSubmit={handleDeleteSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Car ID*</label>
              <input
                type="number"
                name="id"
                value={carData.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="Enter car ID to delete"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}