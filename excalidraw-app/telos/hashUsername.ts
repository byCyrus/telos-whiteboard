import { saveUsernameToLocalStorage } from "../data/localStorage";

const USERNAME_PARAM = "username";

/**
 * Strips known query-style params from the hash without touching the room segment.
 * Supports `#room=id,key&username=Ahmet` and `#room=id,key?username=Ahmet`.
 */
export const stripHashParams = (
  hash: string,
  ...paramNames: string[]
): string => {
  let result = hash;
  for (const paramName of paramNames) {
    result = result.replace(new RegExp(`[&?]${paramName}=[^&]*`, "gi"), "");
  }
  return result;
};

export const getCollaborationHash = (
  hash: string = window.location.hash,
): string => stripHashParams(hash, USERNAME_PARAM);

export const parseUsernameFromHash = (
  hash: string = window.location.hash,
): string | null => {
  const match = hash.match(new RegExp(`[&?]${USERNAME_PARAM}=([^&]*)`, "i"));
  if (!match?.[1]) {
    return null;
  }
  try {
    return decodeURIComponent(match[1].replace(/\+/g, " "));
  } catch {
    return match[1];
  }
};

/** Apply Telos username from URL hash before React mounts (Collab reads localStorage). */
export const applyUsernameFromUrlHash = (): string | null => {
  const username = parseUsernameFromHash();
  if (username?.trim()) {
    saveUsernameToLocalStorage(username.trim());
    return username.trim();
  }
  return null;
};
