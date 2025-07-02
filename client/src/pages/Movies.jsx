import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import EmptyState from '../components/EmptyState'
import { useAppContext } from '../context/AppContext'
import { useSearchParams } from "react-router-dom";

const Movies = () => {

  const { shows } = useAppContext()
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").toLowerCase();

  const filteredShows = searchQuery
    ? shows.filter((m) => m.title.toLowerCase().includes(searchQuery))
    : shows;

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {filteredShows.map((movie, index)=> (
          <MovieCard movie={movie} key={movie._id} index={index}/>
        ))}
      </div>
    </div>
  ) : (
    <EmptyState title="No movies available" subtitle="Please check back later." />
  )
}

export default Movies
