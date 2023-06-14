import Crumbs from "./components/Crumbs";
import { useChromeStorage } from "./hooks";

export const [tabTree] = useChromeStorage("tabTree");

function App() {
	return <Crumbs />;
}

export default App;
