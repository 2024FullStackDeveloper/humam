import DisplayUserContainer from "@/components/dashboard/users/display-user-container";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "المستخدمين",
};
const UsersPage = () => {
  return <DisplayUserContainer />;
};
export default UsersPage;
