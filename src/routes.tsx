
import {
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import Withdraw from "./components/withdraw/Withdraw";
import Liquid from "./components/deposit/Deposit";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Liquid/>,
  },
  {
    path: "withdraw",
    element:  <Withdraw />,
  },
]);