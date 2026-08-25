import React, { useState } from 'react';
import { NavItemConfig, NavColumn, NavLinkItem } from '../../../shared/types/navConfig';
import { Save, ArrowUp, ArrowDown, Eye, EyeOff, Edit3, Plus, Trash2, Image, Sparkles, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface NavigationPageProps {
  navConfig: NavItemConfig[];
  onSaveNavConfig: (config: NavItemConfig[]) => Promise<any>;
}

export default function NavigationPage({ navConfig, onSaveNavConfig }: NavigationPageProps) {
  const [config, setConfig] = useState<NavItemConfig[]>(navConfig || []);
  const [saving, setSaving] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>(navConfig?.[0]?.id || 'nav-shop');
  const [message, setMessage] = useState('');

  const selectedItem = config.find((i) => i.id === selectedItemId) || config[0];

  const handleToggleEnable = (id: string) => {
    setConfig((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === config.length - 1)) return;
    const newConfig = [...config];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newConfig[index];
    newConfig[index] = newConfig[targetIndex];
    newConfig[targetIndex] = temp;
    // Update order
    newConfig.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setConfig(newConfig);
  };

  const handleItemLabelChange = (id: string, newLabel: string) => {
    setConfig((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const handleFeaturedCardChange = (field: string, value: string) => {
    if (!selectedItem) return;
    setConfig((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              featuredCard: {
                title: item.featuredCard?.title || '',
                subtitle: item.featuredCard?.subtitle || '',
                image: item.featuredCard?.image || '',
                ctaText: item.featuredCard?.ctaText || '',
                ctaUrl: item.featuredCard?.ctaUrl || '',
                [field]: value,
              },
            }
          : item
      )
    );
  };

  const handleCtaChange = (field: 'ctaText' | 'ctaUrl', value: string) => {
    if (!selectedItem) return;
    setConfig((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, [field]: value } : item))
    );
  };

  const handleColumnTitleChange = (colIndex: number, newTitle: string) => {
    if (!selectedItem) return;
    const updatedCols = [...selectedItem.columns];
    updatedCols[colIndex].title = newTitle;
    setConfig((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, columns: updatedCols } : item))
    );
  };

  const handleAddLink = (colIndex: number) => {
    if (!selectedItem) return;
    const updatedCols = [...selectedItem.columns];
    const newLink: NavLinkItem = {
      id: `link-${Math.random().toString(36).substring(2, 7)}`,
      label: 'New Link',
      url: '#/shop',
    };
    updatedCols[colIndex].links.push(newLink);
    setConfig((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, columns: updatedCols } : item))
    );
  };

  const handleRemoveLink = (colIndex: number, linkIndex: number) => {
    if (!selectedItem) return;
    const updatedCols = [...selectedItem.columns];
    updatedCols[colIndex].links.splice(linkIndex, 1);
    setConfig((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, columns: updatedCols } : item))
    );
  };

  const handleLinkChange = (colIndex: number, linkIndex: number, field: string, value: any) => {
    if (!selectedItem) return;
    const updatedCols = [...selectedItem.columns];
    updatedCols[colIndex].links[linkIndex] = {
      ...updatedCols[colIndex].links[linkIndex],
      [field]: value,
    };
    setConfig((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, columns: updatedCols } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await onSaveNavConfig(config);
      setMessage('Navigation configuration saved successfully!');
    } catch (err) {
      setMessage('Failed to save navigation configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-white max-w-6xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#C9A227] tracking-wider uppercase flex items-center gap-1">
            <Sparkles size={12} /> Merchandise Control Architecture
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">
            Header & Mega Menu Navigation
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-lg transition-all"
        >
          <Save size={15} /> {saving ? 'Saving Config...' : 'Save Navigation Config'}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-2">
          <Check size={14} /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Top-Level Menu Order & Visibility */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase text-[#C9A227] tracking-wider border-b border-slate-800 pb-2">
            Top Navigation Items (Max 7)
          </h2>

          <div className="space-y-2">
            {config.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  selectedItemId === item.id
                    ? 'bg-slate-800 border-[#C9A227] text-white'
                    : 'bg-slate-950/60 border-slate-850 text-gray-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-gray-500 font-bold">0{idx + 1}</span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleItemLabelChange(item.id, e.target.value)}
                    className="bg-transparent font-extrabold text-xs text-white uppercase outline-none focus:border-b border-[#C9A227] w-28"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleEnable(item.id); }}
                    className={`p-1.5 rounded cursor-pointer ${item.enabled ? 'text-emerald-400 hover:bg-emerald-950' : 'text-gray-600 hover:bg-slate-800'}`}
                    title={item.enabled ? 'Enabled' : 'Disabled'}
                  >
                    {item.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMove(idx, 'up'); }}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMove(idx, 'down'); }}
                    disabled={idx === config.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Mega Menu Inspector & Column Builder */}
        {selectedItem && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header & Featured Card Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase text-white tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Mega Menu Configuration: <span className="text-[#C9A227]">{selectedItem.label}</span></span>
                <span className="text-[10px] text-gray-500 font-mono">Slug: #{selectedItem.slug}</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Bottom CTA Button Label</label>
                  <input
                    type="text"
                    value={selectedItem.ctaText || ''}
                    onChange={(e) => handleCtaChange('ctaText', e.target.value)}
                    placeholder="e.g. SHOP ALL T-SHIRTS"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Bottom CTA Target URL</label>
                  <input
                    type="text"
                    value={selectedItem.ctaUrl || ''}
                    onChange={(e) => handleCtaChange('ctaUrl', e.target.value)}
                    placeholder="e.g. #/t-shirts"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Featured Right Card Settings */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">
                  Right-Column Featured Editorial Card
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Card Headline</label>
                    <input
                      type="text"
                      value={selectedItem.featuredCard?.title || ''}
                      onChange={(e) => handleFeaturedCardChange('title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Card Subtitle</label>
                    <input
                      type="text"
                      value={selectedItem.featuredCard?.subtitle || ''}
                      onChange={(e) => handleFeaturedCardChange('subtitle', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Image URL</label>
                    <input
                      type="text"
                      value={selectedItem.featuredCard?.image || ''}
                      onChange={(e) => handleFeaturedCardChange('image', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1 uppercase text-[9px]">Card CTA Text</label>
                    <input
                      type="text"
                      value={selectedItem.featuredCard?.ctaText || ''}
                      onChange={(e) => handleFeaturedCardChange('ctaText', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mega Menu Columns Editor */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">
                Mega Menu Columns & Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedItem.columns.map((col, colIdx) => (
                  <div key={col.id || colIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <input
                        type="text"
                        value={col.title}
                        onChange={(e) => handleColumnTitleChange(colIdx, e.target.value)}
                        className="bg-transparent font-bold text-xs text-[#C9A227] uppercase outline-none focus:border-b border-[#C9A227]"
                      />
                      <button
                        onClick={() => handleAddLink(colIdx)}
                        className="p-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={11} /> Add Link
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {col.links.map((link, linkIdx) => (
                        <div key={link.id || linkIdx} className="bg-slate-950 p-2 rounded border border-slate-850 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => handleLinkChange(colIdx, linkIdx, 'label', e.target.value)}
                              className="bg-transparent text-white font-semibold text-xs outline-none focus:border-b border-[#C9A227] w-full"
                            />
                            <button
                              onClick={() => handleRemoveLink(colIdx, linkIdx)}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => handleLinkChange(colIdx, linkIdx, 'url', e.target.value)}
                              placeholder="URL path (#/...)"
                              className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-gray-300"
                            />
                            <input
                              type="text"
                              value={link.categoryFilter || ''}
                              onChange={(e) => handleLinkChange(colIdx, linkIdx, 'categoryFilter', e.target.value)}
                              placeholder="Category Filter"
                              className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-gray-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
