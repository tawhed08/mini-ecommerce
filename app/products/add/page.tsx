import ProductForm from "@/components/ProductForm";
import AdminGuard from "@/components/AdminGuard";

export default function AddProductPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <ProductForm />
      </main>
    </AdminGuard>
  );
}