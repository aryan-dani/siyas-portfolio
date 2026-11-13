"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { InquiryOption } from "@/lib/content";

type InquiryValue = InquiryOption["value"];

type InquiryStateValue = {
  option: InquiryValue;
  note: string;
  /** Bumps whenever something outside the form picks an option (Rates, hero). */
  selectionId: number;
};

type InquiryActionsValue = {
  setOption: (option: InquiryValue) => void;
  setNote: (note: string) => void;
  /** Pick an option (and optionally a prefilled note) from anywhere on the page. */
  select: (option: InquiryValue, note?: string) => void;
};

type InquiryContextValue = InquiryStateValue & InquiryActionsValue;

const noop = () => {};

const InquiryStateContext = createContext<InquiryStateValue>({
  option: "single-reel",
  note: "",
  selectionId: 0,
});

const InquiryActionsContext = createContext<InquiryActionsValue>({
  setOption: noop,
  setNote: noop,
  select: noop,
});

/** Full inquiry state + actions. Prefer `useInquiryActions` when only selecting. */
export function useInquiry(): InquiryContextValue {
  const state = useContext(InquiryStateContext);
  const actions = useContext(InquiryActionsContext);
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

/** Stable actions only — Hero / ReelPlayer avoid re-rendering on form keystrokes. */
export function useInquiryActions(): InquiryActionsValue {
  return useContext(InquiryActionsContext);
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [option, setOption] = useState<InquiryValue>("single-reel");
  const [note, setNote] = useState("");
  const [selectionId, setSelectionId] = useState(0);

  const select = useCallback((next: InquiryValue, nextNote?: string) => {
    setOption(next);
    if (nextNote !== undefined) setNote(nextNote);
    setSelectionId((n) => n + 1);
  }, []);

  const state = useMemo(
    () => ({ option, note, selectionId }),
    [option, note, selectionId]
  );

  const actions = useMemo(
    () => ({ setOption, setNote, select }),
    [select]
  );

  return (
    <InquiryActionsContext.Provider value={actions}>
      <InquiryStateContext.Provider value={state}>
        {children}
      </InquiryStateContext.Provider>
    </InquiryActionsContext.Provider>
  );
}
