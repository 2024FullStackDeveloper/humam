import DisplayContactUsContainer from "@/components/dashboard/contact-us/display-contact-us-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ارقام التواصل",
};
const ContactUsPage = () => {
  return <DisplayContactUsContainer />;
}

export default ContactUsPage;