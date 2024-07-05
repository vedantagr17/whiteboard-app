import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { BoardContextProvider } from "./store/BoardProvider";
import { ToolboxContextProvider } from "./store/ToolboxProvider";
import Toolbox from "./components/Toolbox";

const App = () => {
  return (
    <BoardContextProvider>
      <ToolboxContextProvider>
        <Toolbar />
        <Toolbox />
        <Board />
      </ToolboxContextProvider>
    </BoardContextProvider>
  );
};

export default App;
