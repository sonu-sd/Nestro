import Hero from '@/components/website/About-components/Hero'
import Stats from '@/components/website/About-components/Stats'
import Value from '@/components/website/About-components/Value'
import Team from '@/components/website/About-components/Team'
import React from 'react'

export default function page() {
  return (
    <div  className="bg-[#efece6]">
      <Hero/>
      <Stats/>
      <Value/>
      <Team/>
    </div>
  )
}
