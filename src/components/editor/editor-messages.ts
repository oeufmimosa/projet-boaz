/**
 * Protocole de messages postMessage entre la frame parente (toolbar) et
 * l'iframe d'aperçu. Vérifie systématiquement `event.origin` côté receveur
 * pour n'accepter que les messages venant de la même origine.
 */

export const EDITOR_MSG_NAMESPACE = "bz-editor";

export type EditorMessage =
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "iframe-ready" }
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "drafts-snapshot"; keys: string[] }
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "preview-mode"; value: boolean }
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "publish-done" }
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "discard"; key?: string }
  | { ns: typeof EDITOR_MSG_NAMESPACE; type: "image-upload-request"; imageKey: string };

export function postEditorMessage(
  target: Window,
  message: EditorMessage,
  origin = window.location.origin,
) {
  target.postMessage(message, origin);
}

/** Type-guard pour ne traiter que NOS messages, pas du bruit d'autres scripts. */
export function isEditorMessage(data: unknown): data is EditorMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { ns?: string }).ns === EDITOR_MSG_NAMESPACE
  );
}
