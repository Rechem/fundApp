import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({isAllowed, redirectPath = '/login', children}) => {
    if (!isAllowed) {
        console.log(redirectPath)
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;