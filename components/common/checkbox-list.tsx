import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { Check, Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  onItemChange?: (id: string, checked: boolean) => void;
  className?: string;
  title?: string;
}

interface CheckboxItemProps {
  item: CheckboxItem;
  onToggle: (id: string, checked: boolean) => void;
}

const CheckboxItemComponent: React.FC<CheckboxItemProps> = ({ item, onToggle }) => {
  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
        item.disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-accent cursor-pointer'
      }`}
      onClick={() => !item.disabled && onToggle(item.id, !item.checked)}
    >
      <div 
        className={`relative flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
          item.checked 
            ? 'bg-primary border-primary' 
            : 'border-border hover:border-primary/50'
        }`}
      >
        {item.checked && (
          <Check 
            size={14} 
            className="text-white animate-in zoom-in-50 duration-200" 
          />
        )}
      </div>
      <label 
        className={`flex-1 text-sm font-medium cursor-pointer transition-colors duration-200 ${
          item.checked 
            ? 'text-muted-foreground line-through' 
            : 'text-foreground'
        }`}
      >
        {item.label}
      </label>
    </div>
  );
};

const CheckboxList: React.FC<CheckboxListProps> = ({ 
  items, 
  onItemChange, 
  className = '', 
  title 
}) => {
  const [internalItems, setInternalItems] = useState<CheckboxItem[]>(items);
  const [filterText, setFilterText] = useState('');


  useLayoutEffect(()=>{
    setInternalItems(items);
  },[items]);


  const handleItemToggle = (id: string, checked: boolean) => {
    setInternalItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
    
    if (onItemChange) {
      onItemChange(id, checked);
    }
  };

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) {
      return internalItems;
    }
    return internalItems.filter(item => 
      item.label.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [internalItems, filterText]);

  const checkedCount = internalItems.filter(item => item.checked).length;
  const totalCount = internalItems.length;

  return (
    <div className={`w-full mx-auto ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {checkedCount} of {totalCount} completed
          </p>
        </div>
      )}

      {/* Filter Input */}
      <div className="relative mb-3">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Filter items..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
      
      <div className="bg-card border border-border rounded-lg p-2">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <CheckboxItemComponent 
                key={item.id} 
                item={item} 
                onToggle={handleItemToggle}
              />
            ))}
            
            {filteredItems.length === 0 && filterText && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items match "{filterText}"</p>
              </div>
            )}
            
            {internalItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items in the list</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CheckboxList;
