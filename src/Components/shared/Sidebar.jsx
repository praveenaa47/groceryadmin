import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Building2,
  ChevronDown,
  ChevronRight,
  Building2Icon,
  GraduationCap,
  Library,
  BoxIcon,
  FolderOpenDot,
  FolderTree,
  IterationCcw,
  TorusIcon,
  ChefHatIcon,
  ForkKnife,
  Vegan,
  Grid2X2XIcon,
  List,
  Group,
  User2Icon,
  LucideGroup,
  Users,
  CardSim,
  PersonStanding,
  WalletCards,
  Clock,
  PercentIcon,
  UserCheck,
  GitCompareArrows,
  Coins,
  CoinsIcon,
  CodeIcon,
  MessageCircle,
} from "lucide-react";
import { ROUTES } from "../../lib/constants";
const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
    const role = localStorage.getItem("adminRole");
    const permissions = adminInfo.permissions || [];
    setUserRole(role);
    setUserPermissions(permissions);
  }, []);
  const hasPermission = (permissionKey) => {
    if (userRole === "admin" || userRole === undefined) return true;
    return userPermissions.includes(permissionKey);
  };
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: ROUTES.DASHBOARD,
      permission: "dashboard"
    },
    {
      name: "Products",
      icon: <Grid2X2XIcon size={20} />,
      path: ROUTES.PRODUCT_LIST,
      permission: "products"
    },
    {
      name: "Categories",
      icon: <BoxIcon size={20} />,
      isDropdown: true,
      permission: "categories",
      subItems: [
        {
          name: "Main Categories",
          icon: <TorusIcon size={18} />,
          path: ROUTES.MAINCATEGORY,
          permission: "categories"
        },
        {
          name: "Categories",
          icon: <ChefHatIcon size={18} />,
          path: ROUTES.CATEGORY,
          permission: "categories"
        },
        {
          name: "Sub Categories",
          icon: <ForkKnife size={18} />,
          path: ROUTES.SUBCATEGORY,
          permission: "categories"
        },
      ]
    },
    {
      name: "Orders",
      icon: <List size={20} />,
      path: ROUTES.ORDERS_LIST,
      permission: "orders"
    },
    {
      name: "Customers",
      icon: <Users size={20} />,
      path: ROUTES.CUSTOMERS,
      permission: "customers"
    },
    {
      name: "Carousel",
      icon: <WalletCards size={20} />,
      path: ROUTES.CAROUSEL,
      permission: "carousel"
    },
    {
      name: "Sub-Admin",
      icon: <UserCheck size={20} />,
      path: ROUTES.SUBADMIN,
      permission: "subadmins"
    },
    {
      name: "Coupons",
      icon: <CardSim size={20} />,
      path: ROUTES.COUPONS,
      permission: "coupons"
    },
    {
      name: "Time Offers",
      icon: <Clock size={20} />,
      path: ROUTES.DEALPAGE,
      permission: "time_offers"
    },
    {
      name: "Home Gifs",
      icon: <PercentIcon size={20} />,
      path: ROUTES.HOMEOFFER,
      permission: "home_offers"
    },
    {
      name: "Referal",
      icon: <Coins size={20} />,
      path: ROUTES.REFERAL,
      permission: "referral"
    },
  ];
  const footerItems = [
    {
      name: "Notifications",
      icon: <MessageCircle size={20} />,
      path: ROUTES.NOTIFICATION,
      permission: "notifications"
    },
    {
      name: "Logout",
      icon: <LogOut size={20} />,
      path: "/",
      action: () => {
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("adminPermissions");
      },
      permission: "logout"
    },
  ];
  const filteredMenuItems = menuItems.filter(item =>
    item.permission === "logout" || hasPermission(item.permission)
  );
  const filteredFooterItems = footerItems.filter(item =>
    item.permission === "logout" || hasPermission(item.permission)
  );
  const isActive = (path) => location.pathname === path;
  const isDropdownSectionActive = (subItems) => {
    return subItems && subItems.some(subItem => isActive(subItem.path));
  };
  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };
  return (
    <div
      className={`bg-yellow-500 shadow-md h-full ${isHovered ? "w-64" : "w-20"} flex flex-col transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold"><Vegan/></span>
          </div>
          {isHovered && <span className="text-xl font-semibold text-white">GROCERY</span>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              {item.isDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center ${isHovered ? "space-x-3 px-4" : "justify-center px-2"
                      } py-3 rounded-md text-sm font-medium transition-colors
                      ${isDropdownSectionActive(item.subItems)
                        ? "bg-white text-black"
                        : "text-black hover:bg-white"
                      }`}
                  >
                    {item.icon}
                    {isHovered && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {openDropdowns[item.name] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </>
                    )}
                  </button>
                  {/* Dropdown Items */}
                  {isHovered && openDropdowns[item.name] && (
                    <div className="mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <RouterLink
                          key={subIndex}
                          to={subItem.path}
                          className={`flex items-center space-x-3 px-8 py-2 rounded-md text-sm transition-colors
                            ${isActive(subItem.path)
                              ? "bg-white text-black border-r-2 border-blue-600"
                              : "text-black hover:bg-white"
                            }`}
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </RouterLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <RouterLink
                  to={item.path}
                  className={`flex items-center ${isHovered ? "space-x-3 px-4" : "justify-center px-2"
                    } py-3 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? "bg-white text-black"
                      : "text-black hover:bg-white"
                    }`}
                >
                  {item.icon}
                  {isHovered && <span>{item.name}</span>}
                </RouterLink>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-200 px-2 py-4">
        {filteredFooterItems.map((item, index) => (
          <RouterLink
            key={index}
            to={item.path}
            onClick={item.action}
            className={`flex items-center ${isHovered ? "space-x-3 px-4" : "justify-center px-2"
              } py-3 text-black hover:bg-white rounded-md transition`}
          >
            {item.icon}
            {isHovered && <span>{item.name}</span>}
          </RouterLink>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;