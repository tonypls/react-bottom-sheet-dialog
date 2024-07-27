# react-react-bottom-sheet-dialog

[![npm version](https://img.shields.io/npm/v/react-bottom-sheet-dialog.svg)](https://www.npmjs.com/package/react-bottom-sheet-dialog)
[![npm downloads](https://img.shields.io/npm/dm/react-bottom-sheet-dialog.svg)](https://www.npmjs.com/package/react-bottom-sheet-dialog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

react-bottom-sheet-dialog is a lightweight TypeScript library that provides an easy-to-use bottom sheet dialog component for react applications. It's designed to not have any imported packages and be as lightweight as possible.

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
import { BottomSheet } from 'react-bottom-sheet-dialog';

const App: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <BottomSheet
        snapPoints={[100, 300, 600]}
        onOpen={() => console.log('Sheet opened')}
        onClose={() => console.log('Sheet closed')}
        onSnap={(index) => console.log(`Snapped to index ${index}`)}
        backgroundColor="white"
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
