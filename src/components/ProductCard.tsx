import Link from "next/link";

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
};

type ProductCardProps ={
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="overflow-hidden">
            <div className="h-52 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name} 
                    className="h-full w-full" 
                />
            </div>

            <div className="p-6">
                <h2>                
                    {product.name}
                </h2>

            <p className="mt-4">
                {product.description}
            </p>

            <p className="mt-4">
                ¥{product.price.toLocaleString()}
            </p>

            <Link href={`/products/${product.id}`} className=" rounded-lg bg-stone-800 px-10 py-3 text-white"　>
              商品詳細  
            </Link>
            </div>
        </article>
    );
}