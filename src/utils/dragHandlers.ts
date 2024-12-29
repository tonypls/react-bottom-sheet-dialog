import { SnapPointManager } from "./snapPoints";

export interface BottomSheetProps {
  snapPoints?: number[];
  backgroundColor?: string;
  excludeElement?: HTMLElement;
  onSnap?: (snapIndex: number) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

function isExcludedElement(
  props: BottomSheetProps,
  target: EventTarget | null
): boolean {
  if (!props.excludeElement || !target) {
    return false;
  }
  return props.excludeElement.contains(target as Node);
}

export function createDragHandlers(
  element: HTMLElement,
  backdrop: HTMLElement,
  props: BottomSheetProps,
  snapPointManager: SnapPointManager,
  setHeight: (height: number) => void,
  setSnap: (snapIndex: number) => void
) {
  let startY: number;
  let startHeight: number;
  let lastY: number;
  let lastTime: number;
  let velocity: number;
  let isExcludedTouch: boolean;
  let isDragging: boolean = false;

  return {
    start: (event: TouchEvent | MouseEvent) => {
      isExcludedTouch = isExcludedElement(props, event.target);
      if (isExcludedTouch) {
        return;
      }

      isDragging = true;
      startY = lastY =
        "touches" in event ? event.touches[0].clientY : event.clientY;
      startHeight = element.getBoundingClientRect().height;
      lastTime = Date.now();
      velocity = 0;
      element.style.transition = "none";
      backdrop.style.transition = "none";

      // Prevent text selection during drag
      event.preventDefault();
    },
    move: (event: TouchEvent | MouseEvent) => {
      if (isExcludedTouch || !isDragging) {
        return;
      }

      const currentY =
        "touches" in event ? event.touches[0].clientY : event.clientY;
      const currentTime = Date.now();
      const deltaY = currentY - lastY;
      const deltaTime = currentTime - lastTime;

      if (deltaTime > 0) {
        velocity = deltaY / deltaTime;
      }

      const newHeight = calculateNewHeight(startHeight - (currentY - startY));
      setHeight(newHeight);

      lastY = currentY;
      lastTime = currentTime;

      event.preventDefault();
    },
    end: () => {
      if (isExcludedTouch || !isDragging) {
        return;
      }

      isDragging = false;
      element.style.transition = "height 0.2s ease-out";
      backdrop.style.transition = "height 0.2s ease-out";
      const currentHeight = element.getBoundingClientRect().height;

      const targetSnap = determineTargetSnap(currentHeight, velocity);
      setSnap(targetSnap);
    },
  };

  function calculateNewHeight(height: number): number {
    const snapPoints = snapPointManager.getSnapPoints();
    const [lowestSnapPoint, highestSnapPoint] = [
      Math.min(...snapPoints),
      Math.max(...snapPoints),
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
  }

  function determineTargetSnap(
    currentHeight: number,
    velocity: number
  ): number {
    const closestSnapIndex = findClosestSnapIndex(currentHeight);
    const velocityThreshold = 0.5; // Adjust this value to change sensitivity
    const snapPoints = snapPointManager.getSnapPoints();

    if (Math.abs(velocity) > velocityThreshold) {
      // If flicking up
      if (velocity < 0 && closestSnapIndex < snapPoints.length - 1) {
        return closestSnapIndex + 1;
      }
      // If flicking down
      if (velocity > 0 && closestSnapIndex > 0) {
        return closestSnapIndex - 1;
      }
    }

    // If velocity is low, or at the edges, snap to closest
    return closestSnapIndex;
  }

  function findClosestSnapIndex(currentHeight: number): number {
    const snapPoints = snapPointManager.getSnapPoints();
    let closestIndex = 0;
    let smallestDiff = Math.abs(snapPoints[0] - currentHeight);

    for (let index = 1; index < snapPoints.length; index++) {
      const currentDiff = Math.abs(snapPoints[index] - currentHeight);
      if (currentDiff < smallestDiff) {
        smallestDiff = currentDiff;
        closestIndex = index;
      }
    }

    return closestIndex;
  }
}
