import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({isAllowed, redirectPath = '/connexion', children}) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;