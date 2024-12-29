export type SnapPoint = number;

interface BottomSheetEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onSnap?: (snapIndex: number) => void;
}

export interface BottomSheetProps extends BottomSheetEvents {
  snapPoints?: SnapPoint[];
  backgroundColor?: string;
  excludeElement?: HTMLElement;
}

import {
  createBackdropElement,
  setupAccessibility,
  setupElementStyles,
  createDragHandlers,
  SnapPointManager,
} from "./utils";

export function createBottomSheet(
  element: HTMLElement,
  props: BottomSheetProps
) {
  const { backgroundColor = "white" } = props;

  const snapPointManager = new SnapPointManager(props.snapPoints);
  const backdropElement = createBackdropElement(backgroundColor);
  const childrenElement = element.children[0] as HTMLElement;

  function init(): () => void {
    setupElementStyles(element);
    element.append(backdropElement);
    updateChildrenHeight();
    setSnap(0);
    setupAccessibility(element);
    return addEventListeners();
  }

  function updateChildrenHeight(): void {
    if (childrenElement) {
      const newChildrenHeight = childrenElement.offsetHeight;
      snapPointManager.updateChildrenHeight(newChildrenHeight);
      updateBackdropPosition();
    }
  }

  function updateSnapPoints(): void {
    snapPointManager.updateSnapPoints();
  }

  function updateBackdropPosition(): void {
    const snapPoints = snapPointManager.getSnapPoints();
    const currentSheetHeight =
      Number.parseFloat(element.style.height) || snapPoints[0];
    const backdropHeight = Math.max(
      currentSheetHeight - snapPointManager.getChildrenHeight() + 1,
      0
    );
    backdropElement.style.height = `${backdropHeight}px`;
    backdropElement.style.bottom = "0px";
  }

  function addEventListeners(): () => void {
    const handlers = createDragHandlers(
      element,
      backdropElement,
      props,
      snapPointManager,
      setHeight,
      setSnap
    );
    const resizeHandler = () => {
      updateChildrenHeight();
      setSnap(snapPointManager.getCurrentSnap());
    };

    // Touch events
    element.addEventListener("touchstart", handlers.start, { passive: true });
    element.addEventListener("touchmove", handlers.move, { passive: false });
    element.addEventListener("touchend", handlers.end, { passive: true });

    // Mouse events
    element.addEventListener("mousedown", handlers.start);
    window.addEventListener("mousemove", handlers.move);
    window.addEventListener("mouseup", handlers.end);

    window.addEventListener("resize", resizeHandler);

    const resizeObserver = new ResizeObserver(updateChildrenHeight);
    resizeObserver.observe(childrenElement);

    return () => {
      element.removeEventListener("touchstart", handlers.start);
      element.removeEventListener("touchmove", handlers.move);
      element.removeEventListener("touchend", handlers.end);
      element.removeEventListener("mousedown", handlers.start);
      window.removeEventListener("mousemove", handlers.move);
      window.removeEventListener("mouseup", handlers.end);
      window.removeEventListener("resize", resizeHandler);
      resizeObserver.disconnect();
    };
  }

  const handlers = createDragHandlers(
    element,
    backdropElement,
    props,
    snapPointManager,
    setHeight,
    setSnap
  );

  function setHeight(height: number): void {
    element.style.height = `${height}px`;
    updateBackdropPosition();
  }

  function setSnap(snapIndex: number): void {
    const snapPoints = snapPointManager.getSnapPoints();
    snapPointManager.setCurrentSnap(snapIndex);
    const snapValue = snapPoints[snapIndex];

    setHeight(snapValue);
    props.onSnap?.(snapIndex);
    if (snapIndex === 0) {
      props.onClose?.();
    } else if (snapIndex === snapPoints.length - 1) {
      props.onOpen?.();
    }
  }

  function snapTo(snapIndex: number): void {
    const snapPoints = snapPointManager.getSnapPoints();
    if (snapIndex >= 0 && snapIndex < snapPoints.length) {
      setSnap(snapIndex);
    }
  }

  const removeListeners = init();

  return {
    snapTo,
    destroy: () => {
      removeListeners();
      element.removeChild(backdropElement);
      // Reset styles
      element.style.position = "";
      element.style.bottom = "";
      element.style.left = "";
      element.style.right = "";
      element.style.touchAction = "";
      element.style.transition = "";
      element.style.height = "";
      // Remove accessibility attributes
      element.removeAttribute("role");
      element.removeAttribute("aria-modal");
    },
  };
}
