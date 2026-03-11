import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function AddressSelector({ onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    label: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/address');
      if (response.data.success) {
        setAddresses(response.data.data);
        if (response.data.data.length > 0 && !selectedId) {
          handleSelect(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (addr) => {
    setSelectedId(addr._id);
    onSelectAddress(addr);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/address', formData);
      if (response.data.success) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Address added', showConfirmButton: false, timer: 1500 });
        setAddresses([response.data.data, ...addresses]);
        handleSelect(response.data.data);
        setShowAddForm(false);
        setFormData({ fullName: '', phone: '', houseNumber: '', street: '', area: '', city: '', state: '', pincode: '', label: 'Home' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add address' });
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
          <FiMapPin className="text-primary" /> Delivery Address
        </h3>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="text-sm font-semibold text-primary hover:text-orange-600 flex items-center gap-1"
          >
            <FiPlus /> Add New
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddAddress}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input required name="fullName" value={formData.fullName} onChange={onChange} placeholder="Full Name" className="border p-2.5 rounded-xl text-sm" />
            <input required name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number" className="border p-2.5 rounded-xl text-sm" />
            <input required name="houseNumber" value={formData.houseNumber} onChange={onChange} placeholder="House / Flat No." className="border p-2.5 rounded-xl text-sm" />
            <input required name="street" value={formData.street} onChange={onChange} placeholder="Street Name" className="border p-2.5 rounded-xl text-sm" />
            <input required name="area" value={formData.area} onChange={onChange} placeholder="Area / Colony" className="border p-2.5 rounded-xl text-sm md:col-span-2" />
            <input required name="city" value={formData.city} onChange={onChange} placeholder="City" className="border p-2.5 rounded-xl text-sm" />
            <input required name="state" value={formData.state} onChange={onChange} placeholder="State" className="border p-2.5 rounded-xl text-sm" />
            <input required name="pincode" value={formData.pincode} onChange={onChange} placeholder="Pincode" className="border p-2.5 rounded-xl text-sm" />
            <select name="label" value={formData.label} onChange={onChange} className="border p-2.5 rounded-xl text-sm bg-white">
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 shadow-md">Save Address</button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No saved addresses. Please add one to continue.</p>
            ) : (
              addresses.map(addr => (
                <div 
                  key={addr._id}
                  onClick={() => handleSelect(addr)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedId === addr._id ? 'border-primary bg-orange-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                      {addr.label}
                    </span>
                    {selectedId === addr._id && <FiCheck className="text-primary text-lg" />}
                  </div>
                  <p className="font-bold text-gray-800 text-sm">{addr.fullName} <span className="text-gray-500 font-normal">({addr.phone})</span></p>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    {addr.houseNumber}, {addr.street},<br/>
                    {addr.area}, {addr.city},<br/>
                    {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
