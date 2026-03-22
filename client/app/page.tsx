import Image from "next/image";
import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const products = productsData as Product[];
  return (
    <main>
      <h1>({products.length} products found)</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
    </main>
  );
}
