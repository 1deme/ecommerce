import Layout from "@/components/Layout";
import { PutObjectRetentionCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){
    {
        const [editedCategory,setEditedCategory] = useState(null);
        const [name,SetName] = useState('');
        const [parentCategory,setParentCategory] = useState('');
        const [categories, SetCategories] = useState('');
        const [properties,setProperties] = useState([]);
        useEffect(() => {
            fetchCategories()
        }, [])
    
        function fetchCategories(){
            axios.get('/api/categories').then(result => {
                SetCategories(result.data)
            });
        }
    
        async function saveCategory(ev){
            ev.preventDefault();
            const data = {name,
                parentCategory,
                properties:properties.map(p => ({
                    name:p.name,values:p.values.split(',')
                })),};
            if(editedCategory){
                data._id = editedCategory._id
                await axios.put('/api/categories',data);
                setEditedCategory(null);
            }
            else{
                await axios.post('/api/categories', data);
            }
            SetName('');
            setParentCategory('');
            setProperties('');
            fetchCategories();
        }
    
        function editCategory(category){
            setEditedCategory(category);
            SetName(category.name);
            setParentCategory(category.parent?._id);
            setProperties(category.properties.map(({name,values}) =>
                ({name,
                values:values.join(',')})));
        }
    
        function deleteCategory(category){
            swal.fire({
              title: 'Are you sure?',
              text: `Do you want to delete ${category.name}?`,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              confirmButtonText: 'Yes, Delete!',
              confirmButtonColor: '#d55',
              reverseButtons: true,
            }).then(async result => {
              if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
              }
            });
        }

        function addProperty(){
            setProperties(prev => {
                return [...prev, {
                    name:'',
                    values:'',
                }]
            })
        }

        function handlePropNameChange(index, property, newName){
            setProperties(prev => {
                const properties = [...prev];
                properties[index].name = newName;
                return properties;
            });
        }

        function handlePropvaluesChange(index, property, newValues){
            setProperties(prev => {
                const properties = [...prev];
                properties[index].values = newValues;
                return properties;
            });
        }

        function removeProperty(indexToRemove){
            setProperties(prev =>{
                const newProperties = [...prev];
                return newProperties.filter((p,pindex) =>
                {return pindex !== indexToRemove}
                );
            });
        }
    
        return (
            <Layout>
                <h1>categories</h1>
                <label>{editedCategory ?
                 `Edit category ${editedCategory.name}` 
                 : "create New Category name"}</label>
                <form onSubmit={saveCategory} >
                    <div className="flex gap-1">
                        <input
                        className=""
                        type="text" 
                        placeholder={'category name'}
                        onChange={ev => SetName(ev.target.value)}
                        value={name}
                        />
                        <select 
                        className=""
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}
                        >
                            <option value="">no parrent categgory</option>
                            {categories.length > 0 && categories.map(categorie =>(
                                <option value={categorie._id}>
                                    {categorie.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block">Properites</label>
                        <button
                            onClick={addProperty} 
                            type="button" 
                            className="btn-default text-sm mb-2">
                            Add new property
                        </button>
                        {
                            properties.length > 0 &&
                            properties.map((property,index) =>
                                <div className="flex gap-1 mb-2">
                                    <input 
                                    type="text"
                                    className="mb-0"
                                    value={property.name}
                                    onChange={ev => handlePropNameChange(index,
                                        property,
                                    ev.target.value
                                        )}
                                    placeholder="propert name (example:color)"
                                    >
                                    </input>
                                    <input 
                                    type="text"
                                    className="mb-0"
                                    onChange={ev => handlePropvaluesChange(
                                        index,
                                        property,
                                        ev.target.value
                                            )}
                                    value={property.values}
                                    placeholder="values, comma seperated"
                                    >
                                    </input>
                                    <button 
                                    type="button"
                                    onClick={() => removeProperty(index)}
                                    className="btn-default">
                                        Remove
                                    </button>
                                </div>)
                        }
                    </div>
                    <button type="submit" className="btn-primary py-1">Save</button>
                </form>
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>parent category</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(categorie =>(
                            <tr>
                                <td>{categorie.name}</td>
                                <td>{categorie?.parent?.name}</td>
                                <td>
                                    <button 
                                    onClick={() => editCategory(categorie)} 
                                    className="btn-primary mr-1">
                                        Edit
                                    </button>
                                    <button
                                       onClick={() => deleteCategory(categorie)}
                                       className="btn-red">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Layout>
        )
    }
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));