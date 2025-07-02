import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'

const HeroSection = () => {
    const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <Motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'
        >
            <Motion.img 
                variants={itemVariants}
                src={assets.marvelLogo} 
                alt="Marvel Logo" 
                className="max-h-11 lg:h-11 mt-20"
            />

            <Motion.h1 
                variants={itemVariants}
                className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'
            >
                Guardians <br /> of the Galaxy
            </Motion.h1>

            <Motion.div 
                variants={itemVariants}
                className='flex items-center gap-4 text-gray-300'
            >
                <span>Action | Adventure | Sci-Fi</span>
                <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-4.5 h-4.5'/> 2018
                </div>
                <div className='flex items-center gap-1'>
                    <ClockIcon className='w-4.5 h-4.5'/> 2h 8m
                </div>
            </Motion.div>

            <Motion.p 
                variants={itemVariants}
                className='max-w-md text-gray-300'
            >
                In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.
            </Motion.p>

            <Motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> navigate('/movies')} 
                className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
            >
                Explore Movies
                <Motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ArrowRight className="w-5 h-5"/>
                </Motion.span>
            </Motion.button>
        </Motion.div>
    )
}

export default HeroSection
