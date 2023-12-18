import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const DashBoardLayout = () => {
  return (
    <div>
      <Toaster expand={true} closeButton={true} position="top-center" />
      <Outlet />
    </div>
  );
};

export default DashBoardLayout;
