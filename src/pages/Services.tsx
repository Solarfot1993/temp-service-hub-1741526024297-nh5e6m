import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { Service } from '../types';
import { fetchServices } from '../services/serviceService';
import { serviceCategories } from '../data/sampleCredentials';

const Services: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>(serviceCategories);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServices();
        setServices(data);
        
        // Extract unique categories from actual services
        if (data.length > 0) {
          const uniqueCategories = Array.from(new Set(data.map(service => service.category)));
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load services');
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);

  useEffect(() => {
    // Filter services based on search query and selected category
    let filtered = services;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Services</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">Under $25</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">$25 - $50</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">$50 - $100</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">$100+</span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Rating</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">4 Stars & Up</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">3 Stars & Up</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-gray-700">2 Stars & Up</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{filteredServices.length} services found</p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option>Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;