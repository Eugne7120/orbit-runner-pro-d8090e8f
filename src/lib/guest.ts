import { useEffect, useState } from "react";

const GUEST_KEY = "orbit_guest_mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GUEST_KEY) === "true";
}

export function enterGuestMode() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_KEY, "true");
}

export function exitGuestMode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_KEY);
}

export function useGuestMode() {
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    setGuest(isGuestMode());
  }, []);

  return guest;
}
