"use client"
import { useSearchParams,useRouter } from 'next/navigation'
import React from 'react'


export default function Filtersection({ title, data = [], queryKey="" }) {
  //get url
  const searchParams = useSearchParams();
  const router = useRouter()

  // console.log("FILTER DATA:", data);
  //get selected value from url and split then into an array
  const selectValue = searchParams.get(queryKey)?.split(",") || [];
  console.log(selectValue)

  function handleChange(slug){
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(queryKey)?.split(",") || []; 
    let updatedValues;
    if(currentValues.includes(slug)){
      updatedValues = currentValues.filter((Value)=>Value!==slug);
    }else{
      updatedValues=[...currentValues,slug]
    }

    params.set(queryKey,updatedValues.join(","));
    if(updatedValues.length===0){
      params.delete(queryKey);
    }
    router.push(`/store?${params.toString()}`,{scroll:false})
  }

  return (
    <div className="mb-6 pb-4 border-b border-[#E7DDD1]">
      <h3 className="font-semibold mb-3 text-[#1e1e1e] text-[13px]">{title}</h3>

      <div>

      </div>

      {data.map((item) => {
        const active = selectValue.includes(item.slug)

        return (

          <label
            key={item._id}
            className="flex justify-between items-center mb-1 text-[#444444] text-[12px]"
          >
            <div className="flex gap-2">
              <input type="checkbox" 
              checked={active}
              onChange={()=>handleChange(item.slug)}
              />
              
              <span>{item.name}</span>
            </div>

            <span>{item.count}</span>
          </label>
        )
      })}
    </div>

  )
}
