import { Outlet } from "react-router";
import Sidebar from "../Components/shared/Sidebar";
import Header from "../Components/shared/Header";
const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;