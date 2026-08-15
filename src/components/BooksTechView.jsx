import React, { useState } from 'react';
import { 
  BookOpen, 
  ShoppingBag, 
  Check, 
  Plus, 
  Trash2, 
  MapPin, 
  Sparkles, 
  ExternalLink,
  Camera,
  Coins
} from '../utils/icons';
import confetti from 'canvas-confetti';

export default function BooksTechView({ books, onToggleBook, onAddBook, onDeleteBook }) {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Finanzas & CFA');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddBook({
      id: `book-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Autor',
      category: newCategory,
      notes: 'Búsqueda en Strand Bookstore',
      acquired: false
    });
    setNewTitle('');
    setNewAuthor('');
  };

  const handleToggle = (id) => {
    onToggleBook(id);
    const b = books.find(item => item.id === id);
    if (b && !b.acquired) {
      confetti({ particleCount: 15, spread: 35, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Header Banner */}
      <div className="spa-card p-6 border border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Compras Especializadas NYC
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl text-[var(--text-primary)] tracking-tight">
            Strand Bookstore & Guía Tech (B&H / Apple)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Wishlist de libros de segunda mano de Strand ("18 Miles of Books") y puntos de electrónica.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Strand Book Wishlist */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="spa-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                  Wishlist Strand Bookstore (828 Broadway)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Libros de finanzas, ingeniería, economía y sistemas</p>
              </div>
              <span className="text-xs font-mono font-bold bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded">
                {books.filter(b => b.acquired).length} / {books.length} conseguidos
              </span>
            </div>

            {/* Add Book Form */}
            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                placeholder="Título del libro..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                required
              />
              <input
                type="text"
                placeholder="Autor..."
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-1/3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[var(--accent-primary)] text-white font-bold rounded-lg text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Agregar</span>
              </button>
            </form>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {books.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleToggle(b.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    b.acquired
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      b.acquired ? 'bg-emerald-500 text-white font-bold' : 'border border-[var(--border-strong)]'
                    }`}>
                      {b.acquired && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-orange-500 uppercase">{b.category}</span>
                      <h4 className={`font-bold text-[var(--text-primary)] truncate ${b.acquired ? 'line-through text-[var(--text-muted)]' : ''}`}>
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{b.author}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(b.id);
                    }}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Tech Stores & Vintage Souvenirs */}
        <div className="space-y-4 text-xs">
          
          <div className="spa-card p-4 space-y-2.5">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[var(--accent-primary-text)]" />
              B&H Photo Video (420 9th Ave)
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              La meca de la fotografía y gadgets en Manhattan (cerca de Penn Station).
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-[var(--text-secondary)]">
              <p>• <strong>Cámaras de acción:</strong> Insta360 GO Ultra, micrófonos inalámbricos y drones.</p>
              <p>• <strong>Horario Shabat:</strong> Cierra los viernes a las 14:00 y no abre los sábados.</p>
            </div>
          </div>

          <div className="spa-card p-4 space-y-2.5">
            <span className="font-bold text-sm text-amber-500 flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              Tokens Vintage del Metro de NYC
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              En el <em>NY Transit Museum Shop</em> (Grand Central) o en los puestos de <em>Brooklyn Flea (DUMBO)</em> venden llaveros y gemelos hechos con tokens originales de latón del metro de NY de 1953 a 2003 ($15–$25 USD).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
