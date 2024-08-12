import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { UserProvider } from "./contexts/Auth.tsx";
import { InvestmentLevelProvider } from "./contexts/InvestmentLevel.tsx";
import { UserInvestmentProvider } from "./contexts/UserInvestment.tsx";
import { TransactionProvider } from "./contexts/Transaction.tsx";
import { WithdrawalProvider } from "./contexts/WithdrawalRequest.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <InvestmentLevelProvider>
        <UserInvestmentProvider>
          <TransactionProvider>
            <WithdrawalProvider>
              <RouterProvider router={router} />
            </WithdrawalProvider>
          </TransactionProvider>
        </UserInvestmentProvider>
      </InvestmentLevelProvider>
    </UserProvider>
  </React.StrictMode>
);
