import Profile from "@/components/dashboard/profile/profile";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "الملف الشخصي",
};
const ProfilePage = () => {
  return <Profile/>
}

export default ProfilePage;