
import Link from "next/link";
import { products } from "@/data/products";
import { Suspense } from "react";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}


async function ProductContent ({ params, }: { params: Promise<{ id: string}>;}) {
  const { id } = await params;
  const product = products.find((test) => test.id === Number(id));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!product) {
    return <p>商品が見つかりませんでした。</p>;
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-stone-600 underline">
        ← 商品一覧に戻る
      </Link>

      <div className="mt-8">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full rounded-lg object-cover"
        />

        <h1 className="mt-6 text-3xl font-bold">
          {product.name}
        </h1>

        <p className="mt-4 text-stone-600">
          {product.description}
        </p>

        <p className="mt-6 text-xl font-bold">
          ¥{product.price.toLocaleString()}
        </p>
      </div>
    </main>
  );
}


export default function ProductDetailPage({params,}: { params: Promise<{ id: string }>;}) {
  return (
  <Suspense fallback={<p>yomi Komi tyu~</p>}>
    <ProductContent params={ params } />
  </Suspense>
  );
}
