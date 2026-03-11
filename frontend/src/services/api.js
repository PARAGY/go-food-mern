const BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getFoodData() {
    const response = await fetch(`${BASE_URL}/foodData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    return response.json();
  },

  async signup(userData) {
    const response = await fetch(`${BASE_URL}/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    return response.json();
  }
};
import { useState } from 'react';
import { useDispatchCart } from './ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Card({ foodItem, options }) {
  const [qty] = useState(1);
  const [size] = useState(Object.keys(options)[0]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      return navigate('/login');
    }

    setLoading(true);
    try {
      await dispatch({
        type: 'ADD',
        id: foodItem._id,
        name: foodItem.name,
        price: qty * parseInt(options[size]),
        qty: qty,
        size: size,
        img: foodItem.img
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      {/* ... existing card UI code ... */}
      <button 
        className="btn btn-success"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}