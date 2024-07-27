import React, { useEffect, useRef, useState, useCallback } from "react";

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

function getSafeAreaBottom(): number {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;
  return windowHeight - documentHeight;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  snapPoints,
  backgroundColor = "white",
  children,
  excludeElementRef,
  onOpen,
  onClose,
  onSnap,
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [childrenHeight, setChildrenHeight] = useState(0);
  const [snapPointsWithChildHeight, setSnapPointsWithChildHeight] = useState<
    number[]
  >([]);

  const baseStyle = {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
    transition: "height 0.3s ease-out",
  };

  const hasTailwindStyles = backgroundColor.startsWith("bg-");

  const backdropStyle = hasTailwindStyles
    ? baseStyle
    : { ...baseStyle, backgroundColor };

  const updateChildrenHeight = useCallback(() => {
    if (childrenRef.current) {
      const newChildrenHeight = childrenRef.current.offsetHeight;
      if (newChildrenHeight !== childrenHeight) {
        setChildrenHeight(newChildrenHeight);
      }
    }
  }, [childrenHeight]);

  useEffect(() => {
    updateChildrenHeight();
    const resizeObserver = new ResizeObserver(updateChildrenHeight);
    if (childrenRef.current) {
      resizeObserver.observe(childrenRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [updateChildrenHeight]);

  useEffect(() => {
    if (snapPoints) {
      const maxSnapPoint = Math.max(...snapPoints);
      setSnapPointsWithChildHeight(
        childrenHeight > maxSnapPoint
          ? [
              ...snapPoints.filter((point) => point !== maxSnapPoint),
              childrenHeight,
            ]
          : [...snapPoints]
      );
    } else {
      const safeAreaBottom = getSafeAreaBottom();
      setSnapPointsWithChildHeight([safeAreaBottom + 60, childrenHeight]);
    }
  }, [snapPoints, childrenHeight]);

  useEffect(() => {
    setSnap(0);
  }, [snapPointsWithChildHeight]);

  const setSnap = useCallback(
    (snapIndex: number) => {
      const snapValue = snapPointsWithChildHeight[snapIndex];
      if (sheetRef.current) {
        sheetRef.current.style.height = `${snapValue}px`;
      }
      updateBackdropPosition(snapValue);
      onSnap?.(snapIndex);
      if (snapIndex === 0) {
        onClose?.();
      } else if (snapIndex === snapPointsWithChildHeight.length - 1) {
        onOpen?.();
      }
    },
    [snapPointsWithChildHeight, onSnap, onClose, onOpen]
  );

  const updateBackdropPosition = useCallback(
    (currentSheetHeight: number) => {
      if (backdropRef.current) {
        const backdropHeight = Math.max(
          currentSheetHeight - childrenHeight + 1,
          0
        );
        backdropRef.current.style.height = `${backdropHeight}px`;
      }
    },
    [childrenHeight]
  );

  const calculateNewHeight = useCallback(
    (height: number): number => {
      const [lowestSnapPoint, highestSnapPoint] = [
        Math.min(...snapPointsWithChildHeight),
        Math.max(...snapPointsWithChildHeight),
      ];

      if (height >= lowestSnapPoint && height <= highestSnapPoint) {
        return height;
      }

      const rubberBandFactor = 1;
      if (height > highestSnapPoint) {
        const overscroll = height - highestSnapPoint;
        return (
          highestSnapPoint +
          (1 - Math.exp(-overscroll / 200)) * 50 * rubberBandFactor
        );
      }

      const underscroll = lowestSnapPoint - height;
      return (
        lowestSnapPoint -
        (1 - Math.exp(-underscroll / 200)) * 50 * rubberBandFactor
      );
    },
    [snapPointsWithChildHeight]
  );

  const findClosestSnapIndex = useCallback(
    (currentHeight: number): number => {
      return snapPointsWithChildHeight.reduce(
        (closestIndex, snapPoint, index) => {
          const currentDiff = Math.abs(snapPoint - currentHeight);
          const closestDiff = Math.abs(
            snapPointsWithChildHeight[closestIndex] - currentHeight
          );
          return currentDiff < closestDiff ? index : closestIndex;
        },
        0
      );
    },
    [snapPointsWithChildHeight]
  );

  const determineTargetSnap = useCallback(
    (currentHeight: number, velocity: number): number => {
      const closestSnapIndex = findClosestSnapIndex(currentHeight);
      const velocityThreshold = 0.5;

      if (Math.abs(velocity) > velocityThreshold) {
        if (
          velocity < 0 &&
          closestSnapIndex < snapPointsWithChildHeight.length - 1
        ) {
          return closestSnapIndex + 1;
        }
        if (velocity > 0 && closestSnapIndex > 0) {
          return closestSnapIndex - 1;
        }
      }

      return closestSnapIndex;
    },
    [findClosestSnapIndex, snapPointsWithChildHeight]
  );

  const handleInteractionStart = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      if (excludeElementRef?.current?.contains(e.target as Node)) {
        return;
      }

      const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const startHeight = sheetRef.current?.getBoundingClientRect().height || 0;
      let lastY = startY;
      let lastTime = Date.now();
      let velocity = 0;

      const handleInteractionMove = (e: TouchEvent | MouseEvent) => {
        const currentY =
          "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        const currentTime = Date.now();
        const deltaY = currentY - lastY;
        const deltaTime = currentTime - lastTime;

        if (deltaTime > 0) {
          velocity = deltaY / deltaTime;
        }

        const newHeight = calculateNewHeight(startHeight - (currentY - startY));
        if (sheetRef.current) {
          sheetRef.current.style.height = `${newHeight}px`;
        }
        updateBackdropPosition(newHeight);

        lastY = currentY;
        lastTime = currentTime;

        e.preventDefault();
      };

      const handleInteractionEnd = (e: TouchEvent | MouseEvent) => {
        const currentHeight =
          sheetRef.current?.getBoundingClientRect().height || 0;
        const targetSnap = determineTargetSnap(currentHeight, velocity);
        setSnap(targetSnap);

        document.removeEventListener("mousemove", handleInteractionMove);
        document.removeEventListener("touchmove", handleInteractionMove);
        document.removeEventListener("mouseup", handleInteractionEnd);
        document.removeEventListener("touchend", handleInteractionEnd);
      };

      document.addEventListener("mousemove", handleInteractionMove);
      document.addEventListener("touchmove", handleInteractionMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleInteractionEnd);
      document.addEventListener("touchend", handleInteractionEnd);
    },
    [
      calculateNewHeight,
      updateBackdropPosition,
      determineTargetSnap,
      setSnap,
      excludeElementRef,
    ]
  );

  return (
    <div
      ref={sheetRef}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        touchAction: "none",
        transition: "height 0.3s ease-out",
      }}
      role="dialog"
      aria-modal="true"
      onTouchStart={handleInteractionStart}
      onMouseDown={handleInteractionStart}
    >
      <div
        ref={backdropRef}
        className={hasTailwindStyles ? backgroundColor : ""}
        style={backdropStyle}
      />
      <div ref={childrenRef}>{children}</div>
    </div>
  );
};

export default BottomSheet;
