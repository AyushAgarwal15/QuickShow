import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'

const Loading = () => {

  const { nextUrl } = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/' + nextUrl)
      },8000)
    }
  },[])

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  }

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='flex flex-col justify-center items-center h-[80vh] gap-6'
    >
      <Motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className='relative w-16 h-16'
      >
        <Motion.span 
          className='absolute inset-0 rounded-full border-2 border-transparent border-t-primary'
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut"
          }}
        />
        <Motion.span 
          className='absolute inset-0 rounded-full border-2 border-transparent border-l-primary/50'
          style={{ rotate: "90deg" }}
        />
      </Motion.div>
      <Motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-sm"
      >
        Loading...
      </Motion.p>
    </Motion.div>
  )
}

export default Loading
