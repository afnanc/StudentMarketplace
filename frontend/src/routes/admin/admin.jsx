import AdminUserDashboard from "../../components/admin-dashboard/admin-user-dashboard.component";
import AdminAdsDashboard from "../../components/admin-dashboard/admin-ads-dashboard.component";
import UserCreationChart from "../../components/charts/user-creation-chart.component";
import "./admin.css";

// Render the Admin page with 3 components, including user dashboard, ads dashboard and user creation chart
const Admin = () => {
  return (
    <div>
      <div className="user-managment-container">
        <div className="admin-user-dashboard">
          <h2>User Management</h2>
          <AdminUserDashboard />
        </div>
        <div className="user-creation-chart">
          <UserCreationChart />
        </div>
      </div>
      <h2>Admin Dashboard</h2>
      <AdminAdsDashboard />
    </div>
  );
};

export default Admin;
