import { Link, Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="bg-green-600 flex flex-col w-full min-h-screen bg-green-600">
      <nav className="w-full bg-green-1000">
        <ul className="flex justify-center space-x-8 p-5">
        <li>
            <Link
              to="Bataille"
              className="text-white hover:text-black transition duration-200"
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







          

        


