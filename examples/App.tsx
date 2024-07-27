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
