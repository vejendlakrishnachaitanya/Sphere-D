// src/index.js
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter> {/* <--- Router #1 */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);