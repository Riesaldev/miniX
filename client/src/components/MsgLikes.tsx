/**
 * MsgLikes
 * Qué: Muestra contador de likes (placeholder sin lógica de interacción).
 * Cómo: Renderiza un número estático; se ampliará para recibir props (count, likedByMe, onToggle).
 * Por qué: Facilita diseñar composición visual antes de integrar estado real.
 */
const MsgLikes = () => {
  return (
    <div className="text-xs text-emerald-900 flex items-center gap-1" aria-label="Likes del mensaje">
      <i className="bi bi-heart-fill text-rose-500" aria-hidden="true"></i>
      <span>0</span>
    </div>
  );
};

export default MsgLikes;