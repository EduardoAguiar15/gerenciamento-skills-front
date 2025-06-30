import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ModalProvider } from './context/ModalContext';
import AppRoutes from "./routes/Routes";

function App() {
    return (
        <Router>
            <ModalProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </ModalProvider>
        </Router>
    );
}

export default App;
