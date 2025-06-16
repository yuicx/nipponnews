import React from 'react';
import { Check } from 'lucide-react';
import { AppIcon } from '../services/pwaService';

interface IconSelectorProps {
  icons: AppIcon[];
  selectedIconId: string;
  onIconSelect: (iconId: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  icons, 
  selectedIconId, 
  onIconSelect 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3">アプリアイコン</h3>
      <div className="grid grid-cols-2 gap-4">
        {icons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => onIconSelect(icon.id)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedIconId === icon.id
                ? 'border-[#CC0000] bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                <img 
                  src={icon.preview} 
                  alt={icon.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {icon.name}
              </span>
            </div>
            
            {selectedIconId === icon.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#CC0000] rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 アイコンを変更すると、ホーム画面に追加されたアプリのアイコンも更新されます。
        </p>
      </div>
    </div>
  );
};

export default IconSelector;
