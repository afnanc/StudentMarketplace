// Imports
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./routes/authentication/authentication";
import Home from "./routes/home/home";
import Navigation from "./routes/navigation/navigation";
import Search from "./routes/SearchBarNavigation/Search";
import Profile from "./routes/profile/profile";
import Admin from "./routes/admin/admin";
import AdPage from "./routes/ad-page/AdPage";
import UserProfile from "./components/user-profile/user-profile.component";
import { auth } from "./utils/firebase.utils"; 
import MessagePage from "./routes/message-page/message";


// Main App Component
function App() {
  // State for tracking the current user
  const [currentUser, setCurrentUser] = useState(null);

  // Effect for handling Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Render method for App component, setting up routing
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation currentUser={currentUser} />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="Search" element={<Search />} />
          {currentUser && <Route path="profile" element={<Profile />} />}
          <Route path="admin" element={<Admin />} />
          <Route path="ads/:id" element={<AdPage />} />
          <Route path="user/:userId" element={<UserProfile />} />
          <Route path="message/:userId" element={<MessagePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
