import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { Blog } from '../../../shared/types/types.ts';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchBlogs = () => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Blog post published.');
        setTitle('');
        setExcerpt('');
        setContent('');
        setImageUrl('');
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Editorial & brand communications</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Editorial Blogs</h1>
        </div>
        <button
          onClick={fetchBlogs}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Blog Form */}
        <form onSubmit={handleCreateBlog} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Publish Article</h2>
          
          <div className="text-xs space-y-3">
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Post Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Summary Excerpt</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Banner Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Article Body Content</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold uppercase rounded flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Publish Post
          </button>
        </form>

        {/* Blogs list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Active Articles</h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {blogs.map((b) => (
              <div key={b.id} className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl text-xs flex justify-between items-center gap-4">
                <div className="flex gap-3">
                  <img src={b.imageUrl} alt="" className="w-14 h-14 object-cover rounded border border-slate-850" referrerPolicy="no-referrer" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200 capitalize">{b.title}</p>
                    <p className="text-gray-500 font-semibold">{b.excerpt}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Published: {b.date} • Author: {b.author}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBlog(b.id)}
                  className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 rounded cursor-pointer shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
