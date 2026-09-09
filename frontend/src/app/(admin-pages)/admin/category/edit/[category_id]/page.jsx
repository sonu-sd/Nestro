import { fetchCategoryById } from '@/api/api';
import EditForm from '@/components/admin/category/EditFrom'
import React from 'react'

export default async function page({params}) {
    const promise = await params;
    const {success, data, meggage} = await fetchCategoryById(promise.category_id);
    console.log(data)
     if (success == false) {
        throw new Error("Internal server error")
    }


    return (
        <div>
            <EditForm data={data} page="/admin/category" api={`category/edit/${data._id}`}/>
        </div>
    )
}
