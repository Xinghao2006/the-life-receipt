import React from 'react';
import { ReceiptData, ReceiptItem, HiddenContentItem } from '../types';
import { Plus, Trash2, X, Save, Image as ImageIcon, Type as TypeIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface EditorProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  onClose: () => void;
  onSave: () => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange, onClose, onSave }) => {
  
  const updateField = (field: keyof ReceiptData, value: string) => {
    onChange({ ...data, [field]: value } as any);
  };

  const updateItem = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { name: "新项目", qty: 1, price: "无价" }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  // --- Hidden Content Logic ---

  const addHiddenContent = (type: 'text' | 'image') => {
    const newContent: HiddenContentItem = {
      id: Date.now().toString(),
      type,
      content: type === 'image' ? '' : ''
    };
    const currentContent = data.hiddenContent || [];
    onChange({ ...data, hiddenContent: [...currentContent, newContent] });
  };

  const updateHiddenContent = (id: string, value: string) => {
    const currentContent = data.hiddenContent || [];
    const newContent = currentContent.map(item => 
      item.id === id ? { ...item, content: value } : item
    );
    onChange({ ...data, hiddenContent: newContent });
  };

  const removeHiddenContent = (id: string) => {
    const currentContent = data.hiddenContent || [];
    onChange({ ...data, hiddenContent: currentContent.filter(item => item.id !== id) });
  };

  const moveHiddenContent = (index: number, direction: 'up' | 'down') => {
    const currentContent = [...(data.hiddenContent || [])];
    if (direction === 'up' && index > 0) {
      [currentContent[index], currentContent[index - 1]] = [currentContent[index - 1], currentContent[index]];
    } else if (direction === 'down' && index < currentContent.length - 1) {
      [currentContent[index], currentContent[index + 1]] = [currentContent[index + 1], currentContent[index]];
    }
    onChange({ ...data, hiddenContent: currentContent });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shrink-0">
        <h2 className="text-white font-bold text-lg">定制您的收据</h2>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* Basic Info Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">基础信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">店铺/收银员</label>
              <input 
                type="text" 
                value={data.cashier || ''} 
                onChange={(e) => updateField('cashier', e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">日期范围</label>
              <input 
                type="text" 
                value={data.dateRange || ''} 
                onChange={(e) => updateField('dateRange', e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Items Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">清单项目 ({data.items ? data.items.length : 0})</h3>
            <button onClick={addItem} className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">
              <Plus size={14} /> 添加
            </button>
          </div>
          
          <div className="space-y-2">
            {(data.items || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-gray-800 p-2 rounded border border-gray-700">
                <input 
                  type="number" 
                  value={item.qty} 
                  onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                  className="w-10 bg-gray-900 text-center text-white rounded p-1 text-sm border border-gray-600"
                />
                <div className="flex-1 space-y-1">
                  <input 
                    type="text" 
                    value={item.name || ''} 
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="w-full bg-transparent text-white border-b border-gray-600 focus:border-blue-500 outline-none text-sm pb-1"
                    placeholder="项目名称"
                  />
                  <input 
                    type="text" 
                    value={item.price || ''} 
                    onChange={(e) => updateItem(idx, 'price', e.target.value)}
                    className="w-full bg-transparent text-gray-400 text-xs outline-none"
                    placeholder="价格/代价"
                  />
                </div>
                <button onClick={() => removeItem(idx)} className="p-2 text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Hidden Content Section (New) */}
        <section className="space-y-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} /> 彩蛋配置 (扫描条码后显示)
            </h3>
            <p className="text-[10px] text-gray-500">点击下方按钮添加多段文字或图片，支持排序。</p>
          </div>
          
          <div className="space-y-3">
             {(data.hiddenContent || []).map((item, idx) => (
               <div key={item.id} className="bg-gray-800 p-3 rounded border border-gray-700 relative group">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                          {item.type === 'image' ? <ImageIcon size={10} /> : <TypeIcon size={10} />}
                          {item.type === 'image' ? '图片' : '文字'}
                      </span>
                      <div className="flex gap-1">
                          <button onClick={() => moveHiddenContent(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-700 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                          <button onClick={() => moveHiddenContent(idx, 'down')} disabled={idx === (data.hiddenContent?.length || 0) - 1} className="p-1 hover:bg-gray-700 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                          <button onClick={() => removeHiddenContent(item.id)} className="p-1 hover:bg-red-900/50 text-red-400 rounded ml-2"><Trash2 size={12}/></button>
                      </div>
                  </div>

                  {item.type === 'image' ? (
                      <input 
                        type="text"
                        value={item.content}
                        onChange={(e) => updateHiddenContent(item.id, e.target.value)}
                        placeholder="请输入图片链接 (https://...)"
                        className="w-full bg-gray-900 text-white rounded p-2 text-sm border border-gray-600 focus:border-purple-500 outline-none"
                      />
                  ) : (
                      <textarea 
                        value={item.content}
                        onChange={(e) => updateHiddenContent(item.id, e.target.value)}
                        rows={2}
                        placeholder="输入一段文字..."
                        className="w-full bg-gray-900 text-white rounded p-2 text-sm border border-gray-600 focus:border-purple-500 outline-none font-handwriting"
                      />
                  )}
               </div>
             ))}
          </div>

          <div className="flex gap-2">
             <button onClick={() => addHiddenContent('text')} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs flex items-center justify-center gap-2 transition-colors">
                <TypeIcon size={14} /> 添加文字
             </button>
             <button onClick={() => addHiddenContent('image')} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs flex items-center justify-center gap-2 transition-colors">
                <ImageIcon size={14} /> 添加图片
             </button>
          </div>
        </section>
        
        {/* Footer Totals */}
        <section className="space-y-4 pt-4 border-t border-gray-700">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">底部总结</h3>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">总计标签</label>
              <input type="text" value={data.totalLabel || ''} onChange={(e) => updateField('totalLabel', e.target.value)} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" />
            </div>
             <div>
              <label className="block text-xs text-gray-500 mb-1">总计值</label>
              <input type="text" value={data.totalValue || ''} onChange={(e) => updateField('totalValue', e.target.value)} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">税费标签</label>
              <input type="text" value={data.taxLabel || ''} onChange={(e) => updateField('taxLabel', e.target.value)} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" />
            </div>
             <div>
              <label className="block text-xs text-gray-500 mb-1">税费值</label>
              <input type="text" value={data.taxValue || ''} onChange={(e) => updateField('taxValue', e.target.value)} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" />
            </div>
           </div>
        </section>

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 shrink-0 safe-area-bottom">
        <button 
          onClick={onSave}
          className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Save size={20} />
          生成并分享网页
        </button>
      </div>
    </div>
  );
};

export default Editor;