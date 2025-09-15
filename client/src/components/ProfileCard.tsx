import { useContext, useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from '../context/UserContext';

const ProfileCard = () => {
  const ctx = useContext(UserContext);
  const username = ctx?.user?.username;
  const email = ctx?.user?.email;
  const avatar = ctx?.user?.avatar;
  const loading = ctx?.loading;
  const initialBio = (ctx?.user && typeof ctx.user.bio === 'string') ? ctx.user.bio as string : undefined;

  const [bio, setBio] = useState<string>(initialBio || '');
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { setBio(initialBio || ''); }, [initialBio]);

  const openFileDialog = () => { if (!uploading) fileInputRef.current?.click(); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ctx?.authToken) return toast.error('Necesitas iniciar sesión');
    if (!file.type.startsWith('image/')) return toast.error('El archivo debe ser una imagen');
    if (file.size > 2 * 1024 * 1024) return toast.error('La imagen no debe superar 2MB');
    const objectUrl = URL.createObjectURL(file);
    setTempPreview(objectUrl);
    try {
      setUploading(true);
      toast.loading('Subiendo avatar...', { id: 'upload-avatar' });
      const formData = new FormData();
      formData.append('avatar', file);
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/users/avatar`, { method: 'PUT', headers: { Authorization: ctx.authToken }, body: formData });
      const body = await res.json();
      if (body.status !== 'ok') throw new Error(body.message || 'Error subiendo avatar');
      ctx?.updateAvatar(body.data?.avatar || '');
      setTempPreview(null);
      toast.success('Avatar actualizado', { id: 'upload-avatar' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      toast.error(msg, { id: 'upload-avatar' });
    } finally { setUploading(false); }
  };

  const handleSaveBio = async () => {
    if (!ctx?.authToken) return toast.error('Necesitas iniciar sesión');
    const trimmed = bio.trim();
    if (!trimmed) return toast.error('La bio no puede estar vacía');
    if (trimmed.length > 255) return toast.error('La bio no puede superar 255 caracteres');
    try {
      setSavingBio(true);
      toast.loading('Guardando bio...', { id: 'save-bio' });
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/users/bio`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: ctx.authToken }, body: JSON.stringify({ bio: trimmed }) });
      const body = await res.json();
      if (body.status !== 'ok') throw new Error(body.message || 'Error actualizando bio');
      ctx?.updateBio(trimmed);
      toast.success('Bio actualizada', { id: 'save-bio' });
      setEditingBio(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      toast.error(msg, { id: 'save-bio' });
    } finally { setSavingBio(false); }
  };

  if (loading) return <div className="bg-white p-6 rounded-lg shadow-md w-2/3 mx-auto text-center animate-pulse"><p className="text-gray-500">Cargando perfil...</p></div>;
  if (!ctx?.user) return <div className="bg-white p-6 rounded-lg shadow-md w-2/3 mx-auto text-center"><p className="text-gray-600 mb-4">No has iniciado sesión.</p><a href="/login" className="text-emerald-600 underline">Ir a Login</a></div>;

  return (
    <div className="bg-emerald-100/80 p-6 rounded-lg shadow-[6px_12px_20px_rgba(0,0,0,0.1)] shadow-red-600 w-full max-w-xl mx-auto text-center">
      <header className="mb-4 flex flex-col items-center">
        {!avatar && !tempPreview && (
          <button type="button" onClick={openFileDialog} className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-white font-bold cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {username?.charAt(0).toUpperCase() || 'U'}
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">{uploading ? 'Subiendo...' : 'Cambiar'}</span>
          </button>
        )}
        {(avatar || tempPreview) && (
          <div onClick={openFileDialog} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }} role="button" tabIndex={0} aria-label="Cambiar avatar" className="relative group w-24 h-24">
            <img src={tempPreview || avatar || ''} alt="User Avatar" className={`w-24 h-24 border-2 border-emerald-500 rounded-full object-cover cursor-pointer  shadow-lg shadow-red-600 ${uploading ? 'opacity-60' : ''}`} draggable={false} />
            <span className="pointer-events-none select-none absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">{uploading ? 'Subiendo...' : 'Cambiar'}</span>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        <h2 className="text-2xl font-bold mx-4 mt-2 text-emerald-800 ">Bienvenido de nuevo <span className="uppercase text-red-500">{username}</span>!!</h2>
        <p className="text-md text-red-500">{email}</p>
      </header>
      <section className="mb-4 w-full text-center">
        {!editingBio && (
          <div>
            <p className="text-emerald-700 text-xl whitespace-pre-wrap min-h-1/3 justify-center flex pb-4">{bio || 'Aquí puedes añadir una bio con la que dar a conocer tu personalidad o intereses al resto de usuarios.'}</p>

          </div>
        )}
        {editingBio && (
          <div className="space-y-2">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={255} disabled={savingBio} className="w-full border rounded p-2 text-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={4} placeholder="Escribe una breve bio (máx 255 caracteres)" />
            <div className="flex items-center justify-between text-xs text-red-500">
              <span>{bio.length}/255</span>
              <div className="flex gap-2">
                <button onClick={() => { setBio(initialBio || ''); setEditingBio(false); }} className="px-3 py-1 rounded border text-red-600 cursor-pointer hover:bg-red-600 hover:text-emerald-900" disabled={savingBio}>Cancelar</button>
                <button onClick={handleSaveBio} disabled={savingBio} className="px-3 py-1 rounded bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600 disabled:opacity-80">{savingBio ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>
          </div>
        )}
      </section>
      <footer className="flex justify-center gap-4">
        <button
          onClick={() => {
            if (savingBio || editingBio) return;
            setEditingBio(true);
          }}
          className="bg-emerald-500 text-white px-4 py-2 rounded shadow-lg shadow-red-600 hover:bg-emerald-600 transition disabled:opacity-80 cursor-pointer disabled:cursor-not-allowed"
          disabled={savingBio || editingBio}
        >
          {savingBio
            ? 'Guardando...'
            : editingBio
              ? 'Editando ...'
              : (bio ? 'Editar bio' : 'Añadir bio')}
        </button>
      </footer>
    </div >
  );
};

export default ProfileCard;