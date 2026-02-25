import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import CreateAsset from "./pages/CreateAsset";
import ViewAssets from "./pages/ViewAssets";
import ViewUsers from "./pages/ViewUsers";
import StaffRegistration from "./pages/StaffRegistration";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import AdminSeatConfig from "./pages/AdminSeatConfig";
import UserBookSeat from "./pages/UserBookSeat";
import AdminBookingMap from "./pages/AdminBookingMap";
import AssetRequest from "./pages/AssetRequest";
import ITStaffDashboard from "./pages/ITStaffDashboard";
import ITStaffHistory from "./pages/ITStaffHistory";



function App() {
    return (
        // Note: <BrowserRouter> is defined in index.js to avoid nested router errors.
        <Routes>
            {/* 1. Authentication Route */}
            <Route path="/" element={<Login />} />

            {/* 2. Admin Management Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users/create" element={<StaffRegistration />} />
            <Route path="/admin/users/view" element={<ViewUsers />} />
            <Route path="/admin/assets/create" element={<CreateAsset />} />
            <Route path="/admin/assets/view" element={<ViewAssets />} />
            <Route path="/admin/seats/configure" element={<AdminSeatConfig />} />
            <Route path="/admin/bookings/map" element={<AdminBookingMap />} />

                {/* 3. IT Staff Routes */}
            {/* This dashboard allows IT Staff to approve and assign requests */}
            <Route path="/it-staff" element={<ITStaffDashboard />} />
            <Route path="/it-staff/history" element={<ITStaffHistory />} />

            {/* 4. User/Employee Routes */}
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/book-seat" element={<UserBookSeat />} />
            {/* This route handles the asset request form for employees */}
            <Route path="/user/request-asset" element={<AssetRequest />} />

            {/* 5. Catch-all: Redirect unknown URLs back to Login */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;