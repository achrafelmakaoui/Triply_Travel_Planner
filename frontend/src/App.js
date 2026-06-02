import { Routes, Route, } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import PublicTrip from "./pages/PublicTrip/PublicTrip";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/trip/share/:shareId" element={<PublicTrip />} />
            </Routes>
        </>
    );
}

export default App;
