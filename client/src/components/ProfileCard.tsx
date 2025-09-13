import { useContext, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from '../context/UserContext';

const ProfileCard = () => {
  const ctx = useContext(UserContext);

  const username = ctx?.user?.username;
  const email = ctx?.user?.email;
  const avatar = ctx?.user?.avatar;
  const loading = ctx?.loading;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tempPreview, setTempPreview] = useState<string | null>(null);

  const openFileDialog = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ctx?.authToken) {
      toast.error('Necesitas iniciar sesión');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('La imagen no debe superar 2MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempPreview(objectUrl);

    try {
      setUploading(true);
      toast.loading('Subiendo avatar...', { id: 'upload-avatar' });
      const formData = new FormData();
      formData.append('avatar', file);

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/users/avatar`, {
        method: 'PUT',
        headers: {
          Authorization: ctx.authToken,
        },
        body: formData,
      });

      const body = await res.json();
      if (body.status !== 'ok') {
        throw new Error(body.message || 'Error subiendo avatar');
      }

      const newAvatarName: string | null = body.data?.avatar || null;
      if (newAvatarName) ctx.updateAvatar(newAvatarName);
      setTempPreview(null);

      toast.success('Avatar actualizado', { id: 'upload-avatar' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      toast.error(msg, { id: 'upload-avatar' });
      // Si falla, eliminar preview
      setTempPreview(null);
    } finally {
      setUploading(false);
      // limpiar input para permitir misma imagen de nuevo si se desea
      if (fileInputRef.current) fileInputRef.current.value = '';
      // Liberar URL temporal
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-2/3 mx-auto text-center animate-pulse">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  if (!ctx?.user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-2/3 mx-auto text-center">
        <p className="text-gray-600 mb-4">No has iniciado sesión.</p>
        <a href="/login" className="text-emerald-600 underline">Ir a Login</a>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-1/3 mx-auto text-center">
      <header className="mb-4 flex flex-col items-center">
        {!avatar && !tempPreview && (
          <button type="button" onClick={openFileDialog} className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-white font-bold cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {username?.charAt(0).toUpperCase() || 'U'}
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">{uploading ? 'Subiendo...' : 'Cambiar'}</span>
          </button>
        )}
        {(avatar || tempPreview) && (
          <div
            onClick={openFileDialog}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
            role="button"
            tabIndex={0}
            aria-label="Cambiar avatar"
            className="relative group w-24 h-24"
          >
            <img
              src={tempPreview || avatar || ''}
              alt="User Avatar"
              className={`w-24 h-24 border-2 border-emerald-500 shadow-red-600/80 shadow-[0_0_10px_5px_rgba(0,0,0,0)] rounded-full object-cover cursor-pointer ${uploading ? 'opacity-60' : ''}`}
              draggable={false}
            />
            <span className="pointer-events-none select-none absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">
              {uploading ? 'Subiendo...' : 'Cambiar'}
            </span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <h2 className="text-2xl font-bold m-4 ">{`Welcome back ${username}`}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </header>
      <section className="mb-4">
        <p className="text-gray-600">Aquí puedes añadir una bio o información adicional del usuario.</p>
      </section>
      <footer className="flex justify-center gap-4">
        <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">Editar Perfil</button>
      </footer>
    </div>
  );
};

export default ProfileCard;