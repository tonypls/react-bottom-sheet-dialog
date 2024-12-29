export class SnapPointManager {
  private currentSnap: number = 0;
  private childrenHeight: number = 0;
  private snapPointsWithChildHeight: number[] = [];
  private snapPoints?: number[];

  constructor(snapPoints?: number[]) {
    this.snapPoints = snapPoints;
  }

  updateChildrenHeight(newHeight: number): void {
    if (newHeight !== this.childrenHeight) {
      this.childrenHeight = newHeight;
      this.updateSnapPoints();
      this.adjustCurrentSnapPoint();
    }
  }

  updateSnapPoints(): void {
    if (this.snapPoints) {
      const maxSnapPoint = Math.max(...this.snapPoints);
      this.snapPointsWithChildHeight =
        this.childrenHeight > maxSnapPoint
          ? [
              ...this.snapPoints.filter((point) => point !== maxSnapPoint),
              this.childrenHeight,
            ]
          : [...this.snapPoints];
    } else {
      const safeAreaBottom = this.getSafeAreaBottom();
      this.snapPointsWithChildHeight = [
        safeAreaBottom + 60,
        this.childrenHeight,
      ];
    }
  }

  private adjustCurrentSnapPoint(): void {
    const currentSnapValue = this.snapPointsWithChildHeight[this.currentSnap];
    if (
      currentSnapValue === this.childrenHeight ||
      this.currentSnap === this.snapPointsWithChildHeight.length - 1
    ) {
      this.currentSnap = this.snapPointsWithChildHeight.length - 1;
    }
  }

  private getSafeAreaBottom(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.clientHeight;
    return windowHeight - documentHeight;
  }

  getCurrentSnap(): number {
    return this.currentSnap;
  }

  getSnapPoints(): number[] {
    return this.snapPointsWithChildHeight;
  }

  setCurrentSnap(snapIndex: number): void {
    if (snapIndex >= 0 && snapIndex < this.snapPointsWithChildHeight.length) {
      this.currentSnap = snapIndex;
    }
  }

  getChildrenHeight(): number {
    return this.childrenHeight;
  }
}
