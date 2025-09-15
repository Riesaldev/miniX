/**
 * MsgList
 * Qué: Componente placeholder que lista mensajes estáticos.
 * Cómo: Actualmente hardcoded; futuro: consumir API /api/messages (listado paginado) y mostrar likes.
 * Por qué: Sirve de esqueleto para integrar lógica de mensajes sin bloquear avance de otras partes.
 */
const MsgList = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Messages</h2>
      <ul className="list-disc pl-5 text-sm text-emerald-900 space-y-1">
        <li>Message 1</li>
        <li>Message 2</li>
        <li>Message 3</li>
      </ul>
      <p className="mt-4 text-xs text-emerald-800/60">
        (Placeholder) Sustituir por datos reales cuando el endpoint esté conectado.
      </p>
    </div>
  );
};

export default MsgList;