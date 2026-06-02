import { Routes, Route, Navigate, } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import PublicTrip from "./pages/PublicTrip/PublicTrip";
import Dashboard from "./pages/Dashboard/Dashboard";
import TripPlanner from "./pages/TripPlanner/TripPlanner";
import MyTrips from "./pages/MyTrips/MyTrips";
import Profile from "./pages/Profile/Profile";
import TripDetail from "./pages/TripDetail/TripDetail";
import { useAuth } from "./context/AuthContext";

function App() {
    const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
        if (loading) return null;
        return user ? children : <Navigate to="/signin" />;
    };

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/trip/share/:shareId" element={<PublicTrip />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/planner" element={<PrivateRoute><TripPlanner /></PrivateRoute>} />
                <Route path="/trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/trips/:id" element={<PrivateRoute><TripDetail /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;
