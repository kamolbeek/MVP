export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary-300 rounded-full blur-[120px] opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-4">{children}</div>
    </div>
  );
}
