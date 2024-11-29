import { Link, Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <nav className="w-full bg-white shadow-md">
        <ul className="flex justify-center space-x-8 p-5">
        <li>
            <Link
              to="Bataille"
              className="text-gray-700 hover:text-blue-500 transition duration-200"
            >
              Bataille
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-full p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;







          

        


