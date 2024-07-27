import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
export const BottomSheet = ({ snapPoints, backgroundColor = "white", children, excludeElementRef, onOpen, onClose, onSnap, }) => {
    const sheetRef = useRef(null);
    const childrenRef = useRef(null);
    const backdropRef = useRef(null);
    const [currentSnap, setCurrentSnap] = useState(0);
    const [childrenHeight, setChildrenHeight] = useState(0);
    const [snapPointsWithChildHeight, setSnapPointsWithChildHeight] = useState([]);
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
            setSnapPointsWithChildHeight(childrenHeight > maxSnapPoint
                ? [
                    ...snapPoints.filter((point) => point !== maxSnapPoint),
                    childrenHeight,
                ]
                : [...snapPoints]);
        }
        else {
            const safeAreaBottom = getSafeAreaBottom();
            setSnapPointsWithChildHeight([safeAreaBottom + 60, childrenHeight]);
        }
    }, [snapPoints, childrenHeight]);
    useEffect(() => {
        setSnap(0);
    }, [snapPointsWithChildHeight]);
    const setSnap = useCallback((snapIndex) => {
        setCurrentSnap(snapIndex);
        const snapValue = snapPointsWithChildHeight[snapIndex];
        if (sheetRef.current) {
            sheetRef.current.style.height = `${snapValue}px`;
        }
        updateBackdropPosition(snapValue);
        onSnap?.(snapIndex);
        if (snapIndex === 0) {
            onClose?.();
        }
        else if (snapIndex === snapPointsWithChildHeight.length - 1) {
            onOpen?.();
        }
    }, [snapPointsWithChildHeight, onSnap, onClose, onOpen]);
    const updateBackdropPosition = useCallback((currentSheetHeight) => {
        if (backdropRef.current) {
            const backdropHeight = Math.max(currentSheetHeight - childrenHeight + 1, 0);
            backdropRef.current.style.height = `${backdropHeight}px`;
        }
    }, [childrenHeight]);
    const calculateNewHeight = useCallback((height) => {
        const [lowestSnapPoint, highestSnapPoint] = [
            Math.min(...snapPointsWithChildHeight),
            Math.max(...snapPointsWithChildHeight),
        ];
        if (height >= lowestSnapPoint && height <= highestSnapPoint) {
            return height;
        }
        const rubberBandFactor = 0.5;
        if (height > highestSnapPoint) {
            const overscroll = height - highestSnapPoint;
            return (highestSnapPoint +
                (1 - Math.exp(-overscroll / 200)) * 50 * rubberBandFactor);
        }
        const underscroll = lowestSnapPoint - height;
        return (lowestSnapPoint -
            (1 - Math.exp(-underscroll / 200)) * 50 * rubberBandFactor);
    }, [snapPointsWithChildHeight]);
    const findClosestSnapIndex = useCallback((currentHeight) => {
        return snapPointsWithChildHeight.reduce((closestIndex, snapPoint, index) => {
            const currentDiff = Math.abs(snapPoint - currentHeight);
            const closestDiff = Math.abs(snapPointsWithChildHeight[closestIndex] - currentHeight);
            return currentDiff < closestDiff ? index : closestIndex;
        }, 0);
    }, [snapPointsWithChildHeight]);
    const determineTargetSnap = useCallback((currentHeight, velocity) => {
        const closestSnapIndex = findClosestSnapIndex(currentHeight);
        const velocityThreshold = 0.5;
        if (Math.abs(velocity) > velocityThreshold) {
            if (velocity < 0 &&
                closestSnapIndex < snapPointsWithChildHeight.length - 1) {
                return closestSnapIndex + 1;
            }
            if (velocity > 0 && closestSnapIndex > 0) {
                return closestSnapIndex - 1;
            }
        }
        return closestSnapIndex;
    }, [findClosestSnapIndex, snapPointsWithChildHeight]);
    const handleTouchStart = useCallback((e) => {
        if (excludeElementRef?.current?.contains(e.target)) {
            return;
        }
        const touchY = e.touches[0].clientY;
        const startHeight = sheetRef.current?.getBoundingClientRect().height || 0;
        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const newHeight = calculateNewHeight(startHeight - (currentY - touchY));
            if (sheetRef.current) {
                sheetRef.current.style.height = `${newHeight}px`;
            }
            updateBackdropPosition(newHeight);
            e.preventDefault();
        };
        const handleTouchEnd = (e) => {
            const currentHeight = sheetRef.current?.getBoundingClientRect().height || 0;
            const endY = e.changedTouches[0].clientY;
            const velocity = (touchY - endY) / (Date.now() - e.timeStamp);
            const targetSnap = determineTargetSnap(currentHeight, velocity);
            setSnap(targetSnap);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd);
    }, [
        calculateNewHeight,
        updateBackdropPosition,
        determineTargetSnap,
        setSnap,
        excludeElementRef,
    ]);
    return (_jsxs("div", { ref: sheetRef, style: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            touchAction: "none",
            transition: "height 0.3s ease-out",
        }, role: "dialog", "aria-modal": "true", onTouchStart: handleTouchStart, children: [_jsx("div", { ref: backdropRef, style: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor,
                    transition: "height 0.3s ease-out",
                } }), _jsx("div", { ref: childrenRef, children: children })] }));
};
function getSafeAreaBottom() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.clientHeight;
    return windowHeight - documentHeight;
}
export default BottomSheet;
