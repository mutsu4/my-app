import { getProducts } from "@/lib/shopify.ts";
import ProductCard from "@/components/ProductCard.tsx";
import { Suspense } from "react";

async function ProductList() {
  const products = await getProducts();

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 text-black">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}


export default async function Home() {
  return (
      <main className="bg-stone-100 px-20 mx-auto ">
        <p className="text-6 font-bold text-stone-900 text-black">
          暮らしを楽しむ雑貨店<br/>
          毎日を少し楽しくするアイテムを集めました。
        </p>
          <Suspense fallback={<p>Loading...</p>}>
            <ProductList />
          </Suspense>
      </main>

  );
} 
