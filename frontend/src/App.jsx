
import './index.css';
import './assets/styles/header.css';
import './assets/styles/register.css';
import './assets/styles/user.css';

import { Suspense, lazy } from 'react';
import {
    Routes,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';

import Loading from './components/utils/loading';
import AuthService from './services/auth.service';
import { ThemeContext, useTheme } from './contexts/ThemeContext.jsx';

import NewSavedTransaction from './pages/user/newSavedTransaction.jsx';
import SavedTransactions from './pages/user/savedTransactions.jsx';
import EditSavedTransaction from './pages/user/editSavedTransaction.jsx';

// Public pages
const Welcome = lazy(() => import('./pages/welcome.jsx'));
const Login = lazy(() => import('./pages/auth/login/login.jsx'));
const Register = lazy(() => import('./pages/auth/register/register.jsx'));

// Authentication pages
const UserRegistrationVerfication = lazy(() =>
    import('./pages/auth/register/userRegistrationVerification.jsx')
);
const RegistrationSuccess = lazy(() =>
    import('./pages/auth/register/registrationSuccessfull.jsx')
);

const ForgotPasswordEmailVerfication = lazy(() =>
    import('./pages/auth/forgetpassword/forgotPasswordEmailVerification.jsx')
);
const ForgotPasswordCodeVerification = lazy(() =>
    import('./pages/auth/forgetpassword/forgotPasswordCodeVerification.jsx')
);
const ForgotPasswordChangePassword = lazy(() =>
    import('./pages/auth/forgetpassword/changePassword.jsx')
);
const UnAuthorizedAccessPage = lazy(() =>
    import('./pages/auth/unAuthorized.jsx')
);
const NotFoundPage = lazy(() =>
    import('./pages/auth/notFound.jsx')
);

// User pages
const Dashboard = lazy(() => import('./pages/user/dashboard.jsx'));
const Transactions = lazy(() => import('./pages/user/transactions.jsx'));
const NewTransaction = lazy(() => import('./pages/user/newTransaction.jsx'));
const EditTransaction = lazy(() => import('./pages/user/editTransaction.jsx'));
const UserProfile = lazy(() => import('./pages/user/userProfile.jsx'));
const UserStatistics = lazy(() => import('./pages/user/statistics.jsx'));

// Admin pages
const AdminTransactionsManagement = lazy(() =>
    import('./pages/admin/transactions.jsx')
);
const AdminUsersManagement = lazy(() =>
    import('./pages/admin/users.jsx')
);
const AdminCategoriesManagement = lazy(() =>
    import('./pages/admin/categories.jsx')
);
const NewCategory = lazy(() => import('./pages/admin/newCategory.jsx'));
const EditCategory = lazy(() => import('./pages/admin/editCategory.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/adminProfile.jsx'));

// Protected Route
function ProtectedRoute({
    isAllowed,
    redirectPath = '/unauthorized',
    children
}) {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return children || <Outlet />;
}

// Loading Component
function LoadingSpinner() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Loading />
        </div>
    );
}

// Theme Wrapper
function RoutesWrapper({ children, isDarkMode }) {
    return (
        <div className={isDarkMode ? 'dark' : 'light'}>
            {children}
        </div>
    );
}

// Main App
function App() {
    const [isDarkMode, toggleTheme] = useTheme();

    const currentUser = AuthService.getCurrentUser();

    const isAuthenticated = !!currentUser;

    const isUser = isAuthenticated &&
        currentUser.roles?.includes('ROLE_USER');

    const isAdmin = isAuthenticated &&
        currentUser.roles?.includes('ROLE_ADMIN');

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <RoutesWrapper isDarkMode={isDarkMode}>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>

                        {/* Authentication verification routes */}
                        <Route element={
                            <ProtectedRoute isAllowed={!isAuthenticated} />
                        }>
                            <Route
                                path="/auth/userRegistrationVerfication/:email"
                                element={<UserRegistrationVerfication />}
                            />

                            <Route
                                path="/auth/success-registration"
                                element={<RegistrationSuccess />}
                            />

                            <Route
                                path="/auth/forgetpassword/verifyEmail"
                                element={<ForgotPasswordEmailVerfication />}
                            />

                            <Route
                                path="/auth/forgotPassword/verifyAccount/:email"
                                element={<ForgotPasswordCodeVerification />}
                            />

                            <Route
                                path="/auth/forgotPassword/resetPassword/:email"
                                element={<ForgotPasswordChangePassword />}
                            />
                        </Route>

                        {/* User routes */}
                        <Route element={
                            <ProtectedRoute isAllowed={isUser} />
                        }>
                            <Route
                                path="/user/dashboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/user/newTransaction"
                                element={<NewTransaction />}
                            />

                            <Route
                                path="/user/transactions"
                                element={<Transactions />}
                            />

                            <Route
                                path="/user/editTransaction/:transactionId"
                                element={<EditTransaction />}
                            />

                            <Route
                                path="/user/savedTransactions"
                                element={<SavedTransactions />}
                            />

                            <Route
                                path="/user/savedTransactions/new"
                                element={<NewSavedTransaction />}
                            />

                            <Route
                                path="/user/editSavedTransaction/:transactionId"
                                element={<EditSavedTransaction />}
                            />

                            <Route
                                path="/user/statistics"
                                element={<UserStatistics />}
                            />

                            <Route
                                path="/user/settings"
                                element={<UserProfile />}
                            />
                        </Route>

                        {/* Admin routes */}
                        <Route element={
                            <ProtectedRoute isAllowed={isAdmin} />
                        }>
                            <Route
                                path="/admin/transactions"
                                element={<AdminTransactionsManagement />}
                            />

                            <Route
                                path="/admin/users"
                                element={<AdminUsersManagement />}
                            />

                            <Route
                                path="/admin/categories"
                                element={<AdminCategoriesManagement />}
                            />

                            <Route
                                path="/admin/newCategory"
                                element={<NewCategory />}
                            />

                            <Route
                                path="/admin/editCategory/:categoryId"
                                element={<EditCategory />}
                            />

                            <Route
                                path="/admin/settings"
                                element={<AdminProfile />}
                            />
                        </Route>

                        {/* Public routes */}
                        <Route path="/" element={<Welcome />} />

                        <Route
                            path="/auth/login"
                            element={<Login />}
                        />

                        <Route
                            path="/auth/register"
                            element={<Register />}
                        />

                        <Route
                            path="/unauthorized"
                            element={<UnAuthorizedAccessPage />}
                        />

                        {/* 404 */}
                        <Route path="*" element={<NotFoundPage />} />

                    </Routes>
                </Suspense>
            </RoutesWrapper>
        </ThemeContext.Provider>
    );
}

export default App;
