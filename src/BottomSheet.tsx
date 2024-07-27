// BottomSheet.tsx

import React, { useRef, useEffect } from "react";
import { createBottomSheet } from "./baseBottomSheet";

export type SnapPoint = number;

interface BottomSheetEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onSnap?: (snapIndex: number) => void;
}

export interface BottomSheetProps extends BottomSheetEvents {
  snapPoints?: SnapPoint[];
  backgroundColor?: string;
  children: React.ReactNode;
  excludeElementRef?: React.RefObject<HTMLElement>;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  snapPoints,
  backgroundColor = "white",
  excludeElementRef,
  onOpen,
  onClose,
  onSnap,
}) => {
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomSheetRef.current) {
      const bottomSheet = createBottomSheet(bottomSheetRef.current, {
        snapPoints,
        backgroundColor,
        excludeElement: excludeElementRef?.current || undefined,
        onOpen,
        onClose,
        onSnap,
      });
      return () => {
        bottomSheet.destroy();
      };
    }
  }, [snapPoints, backgroundColor, excludeElementRef]);

  return <div ref={bottomSheetRef}>{children}</div>;
};
