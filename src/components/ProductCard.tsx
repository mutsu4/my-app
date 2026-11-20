import Link from "next/link";

type Product = {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
        altText: string | null;
    } | null;
};

type ProductCardProps ={
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="overflow-hidden">
            <div className="h-52 overflow-hidden">
                <img
                    src={product.featuredImage?.url}
                    alt={product.featuredImage?.altText || product.title}
                    className="h-full w-full" 
                />
            </div>

            <div className="p-6">
                <h2>                
                    {product.title}
                </h2>

            <p className="mt-4">
                {product.description}
            </p>

            <p className="mt-4">
                ¥{Number(product.priceRange.minVariantPrice.amount).toLocaleString()} {product.priceRange.minVariantPrice.currencyCode}
            </p>

            <Link href={`/products/${product.handle}`} className=" rounded-lg bg-stone-800 px-10 py-3 text-white" >
              商品詳細  
            </Link>
            </div>
        </article>
    );
}