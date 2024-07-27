# Directory Structure

```
.npmignore
.parcel-cache/
  9edd0ddd8a13c7ea-AssetGraph-0
  data.mdb
  lock.mdb
  requestGraph-613d1a369745f8af-0
  requestGraph-nodes-0-613d1a369745f8af-0
  snapshot-613d1a369745f8af.txt
LICENSE
README.md
examples/
  App.tsx
  index.html
  main.tsx
package.json
src/
  BottomSheet.tsx
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## README.md

```md
# react-react-bottom-sheet-dialog

[![npm version](https://img.shields.io/npm/v/react-bottom-sheet-dialog.svg)](https://www.npmjs.com/package/react-bottom-sheet-dialog)
[![npm downloads](https://img.shields.io/npm/dm/react-bottom-sheet-dialog.svg)](https://www.npmjs.com/package/react-bottom-sheet-dialog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

react-bottom-sheet-dialog is a lightweight JavaScript library that provides an easy-to-use bottom sheet dialog component for web applications. It's designed to be framework agnostic, flexible, customizable, and easy to integrate into any project.

This bottom sheet is designed to do as little as the styling as possible so this leaves the the styling almost completely up to the content of the bottom sheet that is passed in as a child.

[Repo](https://github.com/tonypls/react-bottom-sheet-dialog)

[NPM](https://www.npmjs.com/package/react-bottom-sheet-dialog)

## Features

- Customizable snap points
- Smooth animations and transitions
- Touch-enabled drag interactions
- Accessibility support
- Customizable background color
- Event callbacks for open, close, and snap events
- Exclude specific elements from touch interactions

## Installation

You can install react-bottom-sheet-dialog using npm:

### npm

```bash
npm install react-bottom-sheet-dialog
```

### yarn

```bash
yarn add react-bottom-sheet-dialog
```

### pnpm

```bash
pnpm install react-bottom-sheet-dialog
```

## Usage

Here's a basic example of how to use react-bottom-sheet-dialog:

### React Example

```TypeScript
import React from 'react';
import BottomSheet from 'react-bottom-sheet-dialog';

const App: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <BottomSheet
        snapPoints={[100, 300, 600]}
        onOpen={() => console.log('Sheet opened')}
        onClose={() => console.log('Sheet closed')}
        onSnap={(index) => console.log(`Snapped to index ${index}`)}
      >
        <div style={{ padding: 20 }}>
          <h2>Bottom Sheet Content</h2>
          <p>This is the content of the bottom sheet.</p>
        </div>
      </BottomSheet>
    </div>
  );
};

export default App;
```

## API

### createBottomSheet(element, props)

Creates a new bottom sheet instance.

- `element`: The HTML element that will become the bottom sheet.
- `props`: An object with the following properties:
  - `snapPoints`: An array of numbers representing the snap points in pixels.
  - `backgroundColor`: The background color of the bottom sheet (default: 'white').
  - `excludeElement`: An HTML element to exclude from touch interactions.
  - `onOpen`: Callback function called when the bottom sheet is fully opened.
  - `onClose`: Callback function called when the bottom sheet is closed.
  - `onSnap`: Callback function called when the bottom sheet snaps to a point, receives the snap index as an argument.

Returns an object with the following methods:

- `snapTo(index)`: Moves the bottom sheet to the specified snap point index.
- `destroy()`: Removes all event listeners and cleans up the bottom sheet.

## Browser Support

react-bottom-sheet-dialog supports all modern browsers that are ES6-compatible.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

## package.json

```json
{
  "name": "react-bottom-sheet-dialog",
  "version": "1.0.0",
  "description": "A lightweight TypeScript bottom sheet dialog for react",
  "main": "BottomSheet.js",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tonypls/react-bottom-sheet-dialog.git"
  },
  "keywords": [
    "React",
    "React.js",
    "TypeScript",
    "Bottom",
    "Sheet",
    "Modal",
    "Dialog",
    "Mobile"
  ],
  "author": "tonypls",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/tonypls/react-bottom-sheet-dialog/issues"
  },
  "homepage": "https://github.com/tonypls/react-bottom-sheet-dialog#readme",
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "parcel": "^2.12.0",
    "typescript": "^5.5.4",
    "vite": "^5.3.5"
  }
}

```

## examples/App.tsx

```tsx
import React from "react";
import BottomSheet from "../src/BottomSheet";

const App: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <BottomSheet
        snapPoints={[100, 300, 600]}
        onOpen={() => console.log("Sheet opened")}
        onClose={() => console.log("Sheet closed")}
        onSnap={(index) => console.log(`Snapped to index ${index}`)}
        backgroundColor="pink"
      >
        <div style={{ padding: 20, backgroundColor: "pink" }}>
          <h2>Bottom Sheet Content</h2>
          <p>This is the content of the bottom sheet.</p>
        </div>
      </BottomSheet>
    </div>
  );
};

export default App;

```

## examples/main.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

## src/BottomSheet.tsx

```tsx
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

  const [currentSnap, setCurrentSnap] = useState(0);
  const [childrenHeight, setChildrenHeight] = useState(0);
  const [snapPointsWithChildHeight, setSnapPointsWithChildHeight] = useState<
    number[]
  >([]);

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
      setCurrentSnap(snapIndex);
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

      const rubberBandFactor = 0.5;
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

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (excludeElementRef?.current?.contains(e.target as Node)) {
        return;
      }

      const touchY = e.touches[0].clientY;
      const startHeight = sheetRef.current?.getBoundingClientRect().height || 0;

      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const newHeight = calculateNewHeight(startHeight - (currentY - touchY));
        if (sheetRef.current) {
          sheetRef.current.style.height = `${newHeight}px`;
        }
        updateBackdropPosition(newHeight);
        e.preventDefault();
      };

      const handleTouchEnd = (e: TouchEvent) => {
        const currentHeight =
          sheetRef.current?.getBoundingClientRect().height || 0;
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
      onTouchStart={handleTouchStart}
    >
      <div
        ref={backdropRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor,
          transition: "height 0.3s ease-out",
        }}
      />
      <div ref={childrenRef}>{children}</div>
    </div>
  );
};

export default BottomSheet;

```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "examples"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

## tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

```

## vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./examples",
});

```

