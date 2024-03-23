
import {
  createBrowserRouter,
} from "react-router-dom";
import Withdraw from "./components/withdraw/Withdraw";
import Deposit from "./components/deposit/Deposit";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Deposit/>,
  },
  {
    path: "withdraw",
    element:  <Withdraw />,
  },
]);