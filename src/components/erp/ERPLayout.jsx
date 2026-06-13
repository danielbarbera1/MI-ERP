import Sidebar from "@/components/erp/Sidebar";
import Header from "@/components/erp/Header";

export default function ERPLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
