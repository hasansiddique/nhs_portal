export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#064745]">
      <div className="w-[518px] rounded-[16px] bg-white h-[878px] z-10">
        {children}
      </div>
    </div>
  );
};
