import Image from "next/image";
import {Product} from "@/types/product";

export default function ProductCard({ product }: {product: Product}){
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.price;
    const isLowStock = product.quantity <= 5;

    return (
        <>
        <div>
            <Image src={product.image} alt={product.name} width={300} height={300} />
        </div>

        <h3>{product.name}</h3>

        <p>NGN{(hasDiscount ? product.sale_price : product.price).toLocaleString()}</p>
        {hasDiscount && <p style={{ textDecoration: 'line-through' }}>NGN{product.price.toLocaleString()}</p>}

       <span className={`text-sm font-medium ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
        {isLowStock ? "Few Units Left" : "In Stock"}
      </span>
        </>
    )
}