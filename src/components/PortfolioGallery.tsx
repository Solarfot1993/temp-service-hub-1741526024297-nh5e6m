import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  serviceId?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  onDelete?: (id: string) => void;
  isEditable?: boolean;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ items, onDelete, isEditable = false }) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No portfolio items to display.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
          >
            <div className="h-48" onClick={() => setSelectedItem(item)}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4" onClick={() => setSelectedItem(item)}>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
            
            {isEditable && onDelete && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Edit functionality would go here
                  }}
                  className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Edit portfolio item"
                >
                  <Edit size={16} className="text-indigo-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Delete portfolio item"
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for viewing portfolio item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">{selectedItem.title}</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[60vh] object-contain mb-4"
              />
              {selectedItem.description && (
                <p className="text-gray-700">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;