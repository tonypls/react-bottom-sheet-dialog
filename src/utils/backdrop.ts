export function createBackdropElement(bgColor: string): HTMLDivElement {
  const backdrop = document.createElement("div");
  const hasTailwindBackground = bgColor.includes("bg-");

  if (!hasTailwindBackground) {
    Object.assign(backdrop.style, {
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: bgColor,
      transition: "height 0.2s ease-out",
    });
  }
  if (hasTailwindBackground) {
    Object.assign(backdrop.style, {
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "0",
      transition: "height 0.2s ease-out",
    });
    backdrop.classList.add(bgColor);
  }

  return backdrop;
}
