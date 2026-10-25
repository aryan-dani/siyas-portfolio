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

type InquiryContextValue = {
  option: InquiryValue;
  note: string;
  /** Bumps whenever something outside the form picks an option (Rates, hero). */
  selectionId: number;
  setOption: (option: InquiryValue) => void;
  setNote: (note: string) => void;
  /** Pick an option (and optionally a prefilled note) from anywhere on the page. */
  select: (option: InquiryValue, note?: string) => void;
};

const noop = () => {};
const InquiryContext = createContext<InquiryContextValue>({
  option: "single-reel",
  note: "",
  selectionId: 0,
  setOption: noop,
  setNote: noop,
  select: noop,
});

export function useInquiry() {
  return useContext(InquiryContext);
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

  const value = useMemo(
    () => ({ option, note, selectionId, setOption, setNote, select }),
    [option, note, selectionId, select]
  );

  return (
    <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
  );
}
