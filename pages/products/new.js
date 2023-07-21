import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NewProduct(){
    const [title,setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setgoToProducts] = useState(false);
    const router = useRouter();
    async function createProduct(ev){
        ev.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/products', data);
        setgoToProducts(true);

    }

    if(goToProducts){
        router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
            <h1>new product</h1>
            <label>Product name</label>
            <input type="text" placeholder="product name"
            value={title} onChange={ev => setTitle(ev.target.value)}/>
            <label>description</label>
            <textarea placeholder="description"
            value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
            <label>price (in GEL)</label>
            <input type="number" placeholder="price"
            value={price} onChange={ev => setPrice(ev.target.value)}/>
            <button 
            type="submit" 
            className="btn-primary">add</button>

            </form>
        </Layout>
    );
}