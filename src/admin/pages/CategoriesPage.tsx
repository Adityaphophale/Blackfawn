import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle, Loader2, Tag, Package } from 'lucide-react';
import { Product } from '../../shared/types';

interface CategoriesPageProps {
  categories: any[];
  collections: any[];
  products: Product[];
  onCreateCategory: (cat: any) => Promise<any>;
  onUpdateCategory: (id: string, cat: any) => Promise<any>;
  onDeleteCategory: (id: string) => Promise<any>;
  onCreateCollection: (coll: any) => Promise<any>;
}

export default function CategoriesPage({
  categories,
  collections,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateCollection,
}: CategoriesPageProps) {
  // Create category form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [collName, setCollName] = useState('');

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [editImage, setEditImage] = useState('');

  // Validation and feedback
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});
  const [createErrors, setCreateErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };

  // Validate category name
  const validateName = (name: string, excludeId?: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) return 'Category name is required.';
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';
    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== excludeId
    );
    if (duplicate) return 'A category with this name already exists.';
    return undefined;
  };

  // CREATE category
  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(catName);
    if (nameError) {
      setCreateErrors({ name: nameError });
      return;
    }
    setCreateErrors({});
    setSaving(true);
    try {
      const res = await onCreateCategory({
        name: catName.trim(),
        description: catDesc.trim(),
        status: 'active',
      });
      if (res.success || res.category) {
        setCatName('');
        setCatDesc('');
        showToast('Category created successfully.');
      }
    } catch {
      showToast('Failed to create category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // OPEN edit modal
  const openEditModal = (cat: any) => {
    setEditId(cat.id);
    setEditName(cat.name || '');
    setEditDesc(cat.description || '');
    setEditStatus(cat.status || 'active');
    setEditImage(cat.image || '');
    setEditErrors({});
    setEditModal(true);
  };

  // SAVE edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(editName, editId);
    if (nameError) {
      setEditErrors({ name: nameError });
      return;
    }
    setEditErrors({});
    setSaving(true);
    try {
      const res = await onUpdateCategory(editId, {
        name: editName.trim(),
        description: editDesc.trim(),
        status: editStatus,
        image: editImage.trim() || undefined,
      });
      if (res.success || res.category) {
        setEditModal(false);
        showToast('Category updated successfully.');
      } else {
        showToast(res.error || 'Update failed.', 'error');
      }
    } catch {
      showToast('Failed to update category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // DELETE category
  const handleDeleteCategory = async (id: string) => {
    const productCount = getProductCount(
      categories.find((c) => c.id === id)?.name || ''
    );
    if (productCount > 0) {
      showToast(`Cannot delete: ${productCount} product(s) are assigned to this category.`, 'error');
      setDeleteConfirmId(null);
      return;
    }
    setDeleting(true);
    try {
      const res = await onDeleteCategory(id);
      if (res.success) {
        showToast('Category deleted successfully.');
      }
    } catch {
      showToast('Failed to delete category.', 'error');
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // CREATE collection
  const handleCreateColl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collName.trim()) return;
    setSaving(true);
    try {
      const res = await onCreateCollection({ name: collName.trim() });
      if (res.success || res.collection) {
        setCollName('');
        showToast('Collection created successfully.');
      }
    } catch {
      showToast('Failed to create collection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Hierarchy & grouping control</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Categories & Collections</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Tag size={13} className="text-orange-500" /> Active Categories
            <span className="ml-auto text-[9px] bg-slate-800 px-2 py-0.5 rounded text-gray-400">{categories.length} total</span>
          </h2>

          {/* Create Category Form */}
          <form onSubmit={handleCreateCat} className="space-y-4 bg-slate-950/20 p-4 border border-slate-800 rounded-lg">
            <h3 className="text-[10.5px] font-bold text-orange-500 uppercase tracking-wider">Create Category</h3>
            <div className="text-xs space-y-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => { setCatName(e.target.value); setCreateErrors({}); }}
                  className={`w-full bg-slate-900 border rounded p-2 text-white outline-none focus:border-orange-500 ${
                    createErrors.name ? 'border-red-500' : 'border-slate-800'
                  }`}
                  placeholder="e.g. Printed T-Shirts"
                />
                {createErrors.name && (
                  <p className="text-[10px] text-red-400 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {createErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                  placeholder="Short category description"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-[10.5px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add Category
            </button>
          </form>

          {/* Category Cards */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {categories.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No categories created yet.</p>
            ) : (
              categories.map((c) => {
                const count = getProductCount(c.name);
                const isActive = (c.status || 'active') === 'active';
                return (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-950/30 border border-slate-850 rounded-lg text-xs group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-200 capitalize truncate">{c.name}</p>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                              isActive
                                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50'
                                : 'bg-red-900/40 text-red-400 border border-red-800/50'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-500 line-clamp-1">{c.description || 'No description provided.'}</p>
                        <div className="flex items-center gap-1 mt-1.5 text-gray-500">
                          <Package size={10} />
                          <span className="text-[9px] font-bold">{count} product{count !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 bg-slate-800 hover:bg-orange-600 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Pencil size={12} />
                        </button>

                        {deleteConfirmId === c.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteCategory(c.id)}
                              disabled={deleting}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              {deleting ? <Loader2 size={12} className="animate-spin" /> : 'Yes'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-[9px] font-bold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(c.id)}
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Collections Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Drop Collections</h2>

          <form onSubmit={handleCreateColl} className="space-y-4 bg-slate-950/20 p-4 border border-slate-800 rounded-lg">
            <h3 className="text-[10.5px] font-bold text-orange-500 uppercase tracking-wider">Create Drop Collection</h3>
            <div className="text-xs space-y-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Collection Name</label>
                <input
                  type="text"
                  value={collName}
                  onChange={(e) => setCollName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                  placeholder="e.g. Summer Drop"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-[10.5px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add Collection
            </button>
          </form>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {collections.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950/30 border border-slate-850 rounded-lg text-xs flex justify-between items-center">
                <span className="font-bold text-slate-200 capitalize">{c.name}</span>
                <span className="text-[9px] bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setEditModal(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider">Modify Record</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide mt-0.5">Edit Category</h2>
              </div>
              <button
                onClick={() => !saving && setEditModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-5 space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[9px] tracking-wider">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setEditErrors({}); }}
                  className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500 transition-colors ${
                    editErrors.name ? 'border-red-500' : 'border-slate-800'
                  }`}
                  placeholder="Category name"
                  autoFocus
                />
                {editErrors.name && (
                  <p className="text-[10px] text-red-400 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} /> {editErrors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[9px] tracking-wider">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500 resize-none transition-colors"
                  placeholder="Category description (optional)"
                />
              </div>

              {/* Category Image URL */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[9px] tracking-wider">Image URL</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://example.com/image.jpg (optional)"
                />
                {editImage && (
                  <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[9px] tracking-wider">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('active')}
                    className={`px-4 py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors cursor-pointer ${
                      editStatus === 'active'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-gray-500 hover:border-slate-700'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('inactive')}
                    className={`px-4 py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors cursor-pointer ${
                      editStatus === 'inactive'
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-gray-500 hover:border-slate-700'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg"
                >
                  {saving ? (
                    <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle size={13} /> Save Changes</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  disabled={saving}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-gray-300 text-xs font-bold uppercase rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-xl shadow-2xl text-xs font-bold tracking-wide flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
          style={{ animation: 'slideDown 0.35s ease-out' }}
        >
          {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
