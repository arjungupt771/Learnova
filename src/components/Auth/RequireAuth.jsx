
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles = [] }) {
    const location = useLocation();

    const { isLoggedIn, role } = useSelector((state) => state.auth);

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/signin"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/denied" replace />;
    }

    return <Outlet />;
}

export default RequireAuth;
