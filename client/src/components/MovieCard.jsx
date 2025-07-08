import { StarIcon, Heart } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import { motion as Motion } from 'framer-motion'
import toast from 'react-hot-toast'

const MovieCard = ({movie, index, showHeart=false}) => {
    const navigate = useNavigate()
    const {image_base_url, user, axios, getToken, fetchFavoriteMovies, favoriteMovies} = useAppContext()

    const isFav = favoriteMovies.find(m => m._id === movie._id)

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation();
        try {
            if(!user) return toast.error('Please login to proceed');
            const { data } = await axios.post('/api/user/update-favorite', { movieId: movie._id }, { headers:{ Authorization:`Bearer ${await getToken()}`}});
            if(data.success){
                await fetchFavoriteMovies();
            }
        } catch(err){
            console.error(err);
        }
    }

    const runtimeDisplay = movie.runtime && movie.runtime > 0 ? timeFormat(movie.runtime) : timeFormat(125);
    const genresDisplay = movie.genres && movie.genres.length ? movie.genres.slice(0,2).map(g=>g.name).join(' | ') : 'Drama';

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
            }}
            className='relative flex flex-col justify-between p-3 bg-gray-800 rounded-2xl w-66'
        >
            {showHeart && (
                <Motion.button whileTap={{scale:0.9}} onClick={handleFavoriteToggle} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full z-20">
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                </Motion.button>
            )}
            <Motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
                src={image_base_url + movie.backdrop_path} 
                alt={movie.title}
                className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer z-10'
            />

            <Motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='font-semibold mt-2 truncate'
            >
                {movie.title}
            </Motion.p>

            <Motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-sm text-gray-400 mt-2'
            >
                {new Date(movie.release_date).getFullYear()} • {genresDisplay} • {runtimeDisplay}
            </Motion.p>

            <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='flex items-center justify-between mt-4 pb-3'
            >
                <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
                    className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
                >
                    Buy Tickets
                </Motion.button>

                <Motion.p 
                    className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'
                    whileHover={{ scale: 1.1 }}
                >
                    <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                    {movie.vote_average.toFixed(1)}
                </Motion.p>
            </Motion.div>
        </Motion.div>
    )
}

export default MovieCard
