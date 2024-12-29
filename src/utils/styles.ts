export function setupElementStyles(element: HTMLElement): void {
  Object.assign(element.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    touchAction: "none",
    transition: "height 0.3s ease-out",
    zIndex: "9999",
  });
}
