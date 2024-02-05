import Train from "./components/Train";
import { useChromeStorage } from "./hooks";

export const [tabTree] = useChromeStorage("tabTree");

function App() {
	return <Train />;
}

export default App;
