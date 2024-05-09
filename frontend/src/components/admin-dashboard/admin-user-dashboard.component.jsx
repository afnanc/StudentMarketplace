import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase.utils";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./admin-user-dashboard.component.css";

// Admin dashboard component for user management
const AdminUserDashboard = () => {
  // State hooks for various component states
  const [userChecked, setUserChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4); // 4 users per page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from Firestore database
  const fetchUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "users", userId));
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Navigate to user's profile page
  const viewUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  // Effect hook to check user's admin status and fetch users if current user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().isAdmin) {
          setIsAdmin(true);
          fetchUsers();
        } else {
          setUserChecked(true);
          setIsLoading(false);
        }
      } else {
        navigate("/auth");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Loading state display
  if (isLoading) {
    return <div className="admin-dashboard">Loading...</div>;
  }

  // Access denied display for non-admin users
  if (!isAdmin && userChecked) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </div>
    );
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Main render method for admin user dashboard
  return isAdmin ? (
    <div className="admin-dashboard">
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* User list table */}
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => viewUserProfile(user.id)}
                  className="btn-view-profile"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(users.length / usersPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
      {/* Total user display */}
      <div className="total-users">
        <p>Total Users: {users.length}</p>
      </div>
    </div>
  ) : null;
};

export default AdminUserDashboard;
