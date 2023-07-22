import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Categories(){

    const [name,SetName] = useState('');
    async function saveCategory(ev){
        ev.preventDefault();
        await axios.post('/api/categories', {name});
        SetName('');
    }

    return (
        <Layout>
            <h1>categories</h1>
            <label>New Category name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input
                className="mb-0"
                type="text" 
                placeholder={'category name'}
                onChange={ev => SetName(ev.target.value)}
                value={name}
                />
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
        </Layout>
    )
}