import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen w-full relative">
       <DashboardWrapper>
        {children}
       </DashboardWrapper>

    </div>
  );
};
export default DashboardLayout;
