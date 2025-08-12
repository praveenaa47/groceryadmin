import React, { useState } from "react";
import Customerfilter from "../components/Customerfilter";
import CustomerTable from "../components/CustomerTable";
import { Users } from "lucide-react";

function Customers() {
  return (
    <div>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Customers
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Customerfilter></Customerfilter>
      <CustomerTable></CustomerTable>
    </div>
  );
}

export default Customers;
