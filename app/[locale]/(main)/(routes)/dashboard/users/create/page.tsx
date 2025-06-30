import CreateUserForm from "@/components/dashboard/users/create-user-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "اضافة مستخدم جديد",
};
const CreateUserPage = ()=>{
return <CreateUserForm/>
};
export default CreateUserPage;