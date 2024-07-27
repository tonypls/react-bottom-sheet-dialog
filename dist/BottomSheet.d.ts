import React from "react";
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
export declare const BottomSheet: React.FC<BottomSheetProps>;
export default BottomSheet;
