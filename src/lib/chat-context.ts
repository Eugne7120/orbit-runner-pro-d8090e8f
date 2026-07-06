import { createContext, useContext } from "react";

export const ChatRefreshContext = createContext<() => void>(() => {});
export const useChatRefresh = () => useContext(ChatRefreshContext);
