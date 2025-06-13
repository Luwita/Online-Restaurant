import React, { useState } from 'react';
import { MapPin, Truck, Clock, DollarSign, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Zone {
  id: string;
  name: string;
  description: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedTime: string;
  isAvailable: boolean;
  coverage: string[];
}

const mockZones: Zone[] = [
  {
    id: 'zone_1',
    name: 'Lusaka CBD',
    description: 'Central Business District and surrounding areas',
    deliveryFee: 15,
    minimumOrder: 50,
    estimatedTime: '20-30 min',
    isAvailable: true,
    coverage: ['Cairo Road', 'Independence Avenue', 'Church Road', 'Cha Cha Cha Road'],
  },
  {
    id: 'zone_2',
    name: 'Kabulonga',
    description: 'Kabulonga residential area',
    deliveryFee: 25,
    minimumOrder: 75,
    estimatedTime: '30-45 min',
    isAvailable: true,
    coverage: ['Kabulonga Road', 'Leopards Hill Road', 'Twin Palm Road'],
  },
  {
    id: 'zone_3',
    name: 'Woodlands',
    description: 'Woodlands and nearby suburbs',
    deliveryFee: 20,
    minimumOrder: 60,
    estimatedTime: '25-35 min',
    isAvailable: true,
    coverage: ['Woodlands Stadium', 'Alick Nkhata Road', 'Nationalist Road'],
  },
  {
    id: 'zone_4',
    name: 'Chelston',
    description: 'Chelston residential area',
    deliveryFee: 30,
    minimumOrder: 80,
    estimatedTime: '35-50 min',
    isAvailable: false,
    coverage: ['Chelston Road', 'Makeni Road'],
  },
];

interface ZoneSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ZoneSelector({ isOpen, onClose }: ZoneSelectorProps) {
  const { state, dispatch } = useApp();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = mockZones.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.coverage.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    dispatch({ type: 'SET_DELIVERY_ZONE', payload: zoneId });
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin className="w-6 h-6" />
              <h2 className="text-xl font-bold">Select Delivery Zone</h2>
            </div>
            <p className="text-green-100 text-sm">Choose your delivery area to see available options</p>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-white/20">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by area or street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Zones List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {filteredZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => zone.isAvailable && handleZoneSelect(zone.id)}
                  disabled={!zone.isAvailable}
                  className={`w-full p-6 rounded-xl border transition-all duration-200 text-left ${
                    selectedZone === zone.id
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                      : zone.isAvailable
                      ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                      : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{zone.name}</h3>
                      <p className="text-gray-300 text-sm">{zone.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedZone === zone.id && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        zone.isAvailable
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {zone.isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs">Delivery Fee</span>
                      </div>
                      <div className="font-bold text-white">K{zone.deliveryFee}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Min Order</span>
                      </div>
                      <div className="font-bold text-white">K{zone.minimumOrder}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Est. Time</span>
                      </div>
                      <div className="font-bold text-white">{zone.estimatedTime}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Coverage Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {zone.coverage.map((area) => (
                        <span
                          key={area}
                          className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredZones.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No zones found</h3>
                <p className="text-gray-400">Try searching for a different area</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h4 className="font-medium text-white mb-2">Delivery Information</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Free delivery on orders above K100</li>
                <li>• Delivery times may vary during peak hours</li>
                <li>• Contact support for areas not listed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}