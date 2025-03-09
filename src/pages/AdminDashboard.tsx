import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  DollarSign, 
  Settings, 
  Search, 
  Filter, 
  X, 
  Check, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit, 
  Eye, 
  CreditCard as CardIcon, 
  Landmark, 
  Phone 
} from 'lucide-react';
import { fetchUsers, fetchServices, fetchBookings, fetchPaymentMethods } from '../services/adminService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters and search
  const [userSearch, setUserSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'services') {
      loadServices();
    } else if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'payments') {
      loadPayments();
    }
  }, [activeTab]);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      setLoading(false);
    }
  };
  
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
      setLoading(false);
    }
  };
  
  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
      setLoading(false);
    }
  };
  
  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await fetchPaymentMethods();
      setPayments(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
      setLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                         service.provider_name.toLowerCase().includes(serviceSearch.toLowerCase());
    
    if (serviceStatusFilter === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && service.status === serviceStatusFilter;
  });
  
  const filteredBookings = bookings.filter(booking => {
    if (bookingStatusFilter === 'all') {
      return true;
    }
    
    return booking.status.toLowerCase() === bookingStatusFilter.toLowerCase();
  });
  
  const renderDashboard = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">1,245</h3>
              </div>
              <div className="bg-indigo-100 p-2 rounded-md">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 flex items-center">
                <ArrowUp size={16} className="mr-1" />
                12%
              </span>
              <span className="text-gray-500 ml-2">Since last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Services</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">348</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 flex items-center">
                <ArrowUp size={16} className="mr-1" />
                8%
              </span>
              <span className="text-gray-500 ml-2">Since last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">1,827</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 flex items-center">
                <ArrowUp size={16} className="mr-1" />
                24%
              </span>
              <span className="text-gray-500 ml-2">Since last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$48,295</h3>
              </div>
              <div className="bg-yellow-100 p-2 rounded-md">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-red-600 flex items-center">
                <ArrowDown size={16} className="mr-1" />
                3%
              </span>
              <span className="text-gray-500 ml-2">Since last month</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">House Cleaning</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-15</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Plumbing Repair</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-14</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Math Tutoring</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Michael Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-13</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Upcoming</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Photography</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Emily Davis</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-12</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">New Users</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="User" className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">John Doe</h4>
                  <p className="text-xs text-gray-500">Joined 2 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Customer</span>
              </div>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="User" className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Jane Smith</h4>
                  <p className="text-xs text-gray-500">Joined 3 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Provider</span>
              </div>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="User" className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Michael Johnson</h4>
                  <p className="text-xs text-gray-500">Joined 5 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Customer</span>
              </div>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="User" className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Emily Davis</h4>
                  <p className="text-xs text-gray-500">Joined 1 week ago</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Provider</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderUsers = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
              <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} alt={user.full_name} className="w-8 h-8 rounded-full mr-3" />
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_provider ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                          {user.is_provider ? 'Provider' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye size={18} />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderServices = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Management</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">All Services</h3>
              <p className="text-sm text-gray-500">Manage service listings and approvals</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <select
                value={serviceStatusFilter}
                onChange={(e) => setServiceStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={service.image_url} alt={service.title} className="w-10 h-10 rounded-md object-cover mr-3" />
                          <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.provider_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${service.price}/hr</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.status === 'active' ? 'bg-green-100 text-green-800' :
                          service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(service.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye size={18} />
                          </button>
                          {service.status === 'pending' && (
                            <>
                              <button className="text-green-600 hover:text-green-900">
                                <Check size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <X size={18} />
                              </button>
                            </>
                          )}
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderBookings = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Management</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
              <p className="text-sm text-gray-500">Monitor and manage service bookings</p>
            </div>
            <div className="flex gap-4">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                More Filters
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.userFullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.providerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.date} at {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye size={18} />
                          </button>
                          {booking.status === 'Upcoming' && (
                            <button className="text-green-600 hover:text-green-900">
                              <Check size={18} />
                            </button>
                          )}
                          {(booking.status === 'Upcoming' || booking.status === 'Confirmed') && (
                            <button className="text-red-600 hover:text-red-900">
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderPayments = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Management</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
              <p className="text-sm text-gray-500">View and manage user payment methods</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={payment.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(payment.userName)}&background=random`} alt={payment.userName} className="w-8 h-8 rounded-full mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                            <div className="text-xs text-gray-500">{payment.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.type === 'card' ? 'bg-blue-100 text-blue-800' :
                          payment.type === 'bank' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {payment.type === 'card' ? 'Credit Card' :
                           payment.type === 'bank' ? 'Bank Account' :
                           'Mobile Money'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.type === 'card' && `•••• ${payment.cardNumber.slice(-4)}`}
                        {payment.type === 'bank' && `${payment.bankName} •••• ${payment.accountNumber.slice(-4)}`}
                        {payment.type === 'mobile' && `${payment.provider} •••• ${payment.phoneNumber.slice(-4)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.isDefault ? (
                          <span className="text-green-600">
                            <Check size={18} />
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Transactions</h3>
          <p className="text-sm text-gray-500 mb-6">View all payment transactions on the platform</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN-12345</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CleanPro Services</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">House Cleaning</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$105.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-15</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN-12346</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Quick Fix Plumbing</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Plumbing Repair</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$150.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-14</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN-12347</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Michael Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Michael Chen</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Math Tutoring</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$45.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-13</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN-12348</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Emily Davis</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Elena Rodriguez Photography</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Portrait Photography</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$240.00</td>
                  <td className="px-6 py-4 whit espaces-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-12</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN-12349</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">David Wilson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Green Thumb Landscaping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lawn Mowing</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$100.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-09-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSettings = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Settings</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Payment Providers</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <CardIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Stripe</h5>
                      <p className="text-sm text-gray-500">Credit card payments</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-md mr-3">
                      <Landmark className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">PayPal</h5>
                      <p className="text-sm text-gray-500">PayPal payments</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Mobile Money</h5>
                      <p className="text-sm text-gray-500">Mobile money payments</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-md mr-3">
                      <Landmark className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">Bank Transfer</h5>
                      <p className="text-sm text-gray-500">Direct bank transfers</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Supported Countries</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">🇺🇸 United States</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">🇬🇭 Ghana</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">🇳🇬 Nigeria</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">🇬🇧 United Kingdom</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">🇨🇦 Canada</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Fees</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Fee (%)
                  </label>
                  <input
                    id="platformFee"
                    type="number"
                    min="0"
                    step="0.1"
                    defaultValue="5.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="paymentProcessingFee" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Processing Fee (%)
                  </label>
                  <input
                    id="paymentProcessingFee"
                    type="number"
                    min="0"
                    step="0.1"
                    defaultValue="2.9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Payment Settings
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Settings</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Service Categories</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  Cleaning
                  <button className="ml-1 text-indigo-600 hover:text-indigo-800">
                    <X size={14} />
                  </button>
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  Plumbing
                  <button className="ml-1 text-indigo-600 hover:text-indigo-800">
                    <X size={14} />
                  </button>
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  Tutoring
                  <button className="ml-1 text-indigo-600 hover:text-indigo-800">
                    <X size={14} />
                  </button>
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  Photography
                  <button className="ml-1 text-indigo-600 hover:text-indigo-800">
                    <X size={14} />
                  </button>
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  Gardening
                  <button className="ml-1 text-indigo-600 hover:text-indigo-800">
                    <X size={14} />
                  </button>
                </span>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Add new category"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Service Approval</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="serviceApproval" className="text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">Auto-approve all services</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="serviceApproval" className="text-indigo-600 focus:ring-indigo-500 mr-2" />
                  <span className="text-gray-700">Require admin approval for all services</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="serviceApproval" className="text-indigo-600 focus:ring-indigo-500 mr-2" />
                  <span className="text-gray-700">Auto-approve for verified providers only</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Email Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">New user registrations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">New service listings</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">Completed bookings</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" defaultChecked />
                  <span className="text-gray-700">Disputed bookings</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Platform Settings
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md fixed h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-indigo-600">Admin Portal</h1>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart2 size={20} className="mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'users'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'services'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag size={20} className="mr-3" />
                  <span>Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'bookings'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard size={20} className="mr-3" />
                  <span>Bookings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'payments'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <DollarSign size={20} className="mr-3" />
                  <span>Payments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} className="mr-3" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;