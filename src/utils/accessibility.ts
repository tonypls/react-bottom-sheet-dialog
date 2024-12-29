export function setupAccessibility(element: HTMLElement): void {
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
}
