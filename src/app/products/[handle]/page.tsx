
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify.ts";
import AddToCartForm from "@/components/AddToCartForm";


async function ProductContent ({ params, }: { params: Promise<{ handle: string}>;}) {
const { handle: encodedHandle } = await params;
const handle = decodeURIComponent(encodedHandle);
const products = await getProducts();
const product = products.find((item) => item.handle === handle);

  if (!product) {
    return <p>商品が見つかりませんでした。</p>;
  }
  if (!product.featuredImage) {
  return <p>商品画像が登録されていません。</p>;
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-stone-600 underline">
        ← 商品一覧に戻る
      </Link>

      <div className="mt-8">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className="h-72 w-full rounded-lg object-cover"
        />

        <h1 className="mt-6 text-3xl font-bold">
          {product.title}
        </h1>

        <p className="mt-4 text-stone-600">
          {product.description}
        </p>

        <p className="mt-6 text-xl font-bold">
          {Number(product.priceRange.minVariantPrice.amount).toLocaleString()} {product.priceRange.minVariantPrice.currencyCode}
        </p>
      </div>
      <AddToCartForm
        merchandiseId={product.variants.nodes[0].id}
      />
    </main>
  );
}


export default function ProductDetailPage({params,}: { params: Promise<{ handle : string }>;}) {
  return (
  <Suspense fallback={<p>yomi Komi tyu~</p>}>
    <ProductContent params={ params } />
  </Suspense>
  );
}
