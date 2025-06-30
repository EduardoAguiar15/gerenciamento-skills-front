import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/LoginForm/LoginForm";
import Register from "../pages/Register/Register";
import Skills from "../pages/Home/Home";
import Forgot from "../pages/Forgot/Forgot";
import NewPassword from "../pages/NewPassword/NewPassword";
import NotFound from "../pages/NotFound/NotFound";
import PropTypes from "prop-types";

const PrivateRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/skills" element={<PrivateRoute element={<Skills />} />} />
            <Route path="/esqueci-senha" element={<Forgot />} />
            <Route path="/redefinir-senha" element={<NewPassword />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;