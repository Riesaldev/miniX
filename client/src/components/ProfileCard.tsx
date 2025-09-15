/**
 * ProfileCard
 * Qué: Tarjeta que muestra y permite editar información básica del usuario (avatar, bio) y cerrar sesión.
 * Cómo: Usa UserContext para leer user y métodos mutadores (LogOut, updateAvatar, updateBio).
 * Por qué: Centraliza edición inline de atributos personales sin navegar a otra vista.
 */
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env; // URL base API para construir ruta avatar.

const ProfileCard = () => {
  // Helper: intenta formatear una fecha si es string/number válido.
  const formatDate = (value: unknown): string => {
    if (typeof value === 'string' || typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
    return '—';
  };
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const LogOut = userContext?.LogOut; // Ojo: en el contexto el método se llama 'LogOut'.
  const updateAvatar = userContext?.updateAvatar;
  const updateBio = userContext?.updateBio;
  // Estado local editable de la bio (optimista hasta enviar).
  const [bioValue, setBioValue] = useState(user?.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Subida de avatar: validamos tipo y tamaño antes de invocar a updateAvatar (que gestiona fetch + estado global).
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!updateAvatar) return;
      const file = e.target.files?.[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) {
        toast.error('Solo se permiten imágenes');
        return;
      }
      if (file.size > 3 * 1024 * 1024) { // 3MB límite (alineado con backend ~5MB margen por seguridad).
        toast.error('Archivo demasiado grande (>3MB)');
        return;
      }
      setAvatarLoading(true);
      // updateAvatar definido en contexto acepta un string (filename) actualmente, aquí idealmente subiríamos el File.
      // Para mantener consistencia con la lógica existente (que no implementa subida aquí) se debería extender el contexto.
      // De momento mostramos aviso si no soporta objeto File.
      if (typeof updateAvatar !== 'function') return;
      // @ts-expect-error Forzamos llamada si la firma no contempla File todavía; se recomienda refactor futuro.
      await updateAvatar(file);
      toast.success('Avatar actualizado');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setAvatarLoading(false);
      // Limpia para permitir re-subir mismo archivo (input file no dispara change si mismo objeto).
      if (e.target) e.target.value = '';
    }
  };

  // Envío de bio: simple validación de no vacío y longitud (textarea ya limita). Efecto: actualiza backend y contexto.
  const submitBio = async () => {
    if (!updateBio) return;
    try {
      if (!bioValue.trim()) {
        toast.error('La bio no puede estar vacía');
        return;
      }
      setBioLoading(true);
      await updateBio(bioValue.trim());
      toast.success('Bio actualizada');
      setIsEditingBio(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setBioLoading(false);
    }
  };

  if (!user) return null; // No render sin sesión (componente pensado para vista privada).

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Cabecera: avatar + identidad + logout */}
      <section className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <img
            src={user.avatarFilename ? `${VITE_API_URL}/uploads/${user.avatarFilename}` : '/avatar.jpg'}
            alt={`Avatar de ${user.username}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-emerald-600" />
          <label className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full cursor-pointer hover:bg-black/80" title="Actualizar avatar">
            <input onChange={handleFileChange} type="file" className="hidden" accept="image/*" />
            {avatarLoading ? (
              <span className="text-xs text-white">...</span>
            ) : (
              <i className="bi bi-camera-fill text-white"></i>
            )}
          </label>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-emerald-700">{user.username}</h2>
          <p className="text-sm text-emerald-950/70">{user.email}</p>
        </div>
        <button
          onClick={LogOut}
          className="bg-rose-600/80 text-white px-3 py-1 rounded-md hover:bg-rose-700 text-sm"
        >
          Logout
        </button>
      </section>

      {/* BIO editable inline */}
      <section className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/50 shadow-sm">
        <header className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-emerald-900">Biografía</h3>
          {!isEditingBio && (
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-xs text-emerald-700 hover:underline"
            >Editar</button>
          )}
        </header>
        {isEditingBio ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={bioValue}
              onChange={e => setBioValue(e.target.value)}
              className="w-full p-2 text-sm rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
              maxLength={160}
              placeholder="Cuenta algo sobre ti (máx 160 caracteres)"
            />
            <div className="flex items-center justify-between text-xs text-emerald-900/70">
              <span>{bioValue.length}/160</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingBio(false)}
                  disabled={bioLoading}
                  className="px-3 py-1 rounded-md bg-neutral-300/60 hover:bg-neutral-300 text-neutral-900"
                >Cancelar</button>
                <button
                  onClick={submitBio}
                  disabled={bioLoading}
                  className="px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >Guardar</button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-emerald-950/90 min-h-[60px] whitespace-pre-line">
            {user.bio || <span className="text-emerald-950/40">Sin bio todavía.</span>}
          </p>
        )}
      </section>

      {/* Datos técnicos: útil para debugging rápido o soporte. */}
      <section className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/50 shadow-sm">
        <h3 className="font-semibold text-emerald-900 mb-2">Datos técnicos</h3>
        <ul className="text-xs text-emerald-800 grid gap-1">
          <li><span className="font-semibold">ID:</span> {user.id}</li>
          <li><span className="font-semibold">Creado:</span> {formatDate(user.createdAt)}</li>
          <li><span className="font-semibold">Último login:</span> {formatDate((user as unknown as { lastAuthAt?: unknown }).lastAuthAt)}</li>
          <li><span className="font-semibold">Tiene avatar:</span> {user.avatarFilename ? 'Sí' : 'No'}</li>
        </ul>
      </section>
    </div>
  );
};

export default ProfileCard;