import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import SearchBar from "../../components/SearchBar";

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const {axios, getToken, user} = useAppContext()

    const [bookings, setBookings] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        try {
          const { data } = await axios.get("/api/admin/all-bookings", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setBookings(data.bookings)
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false)
    };

     useEffect(() => {
      if (user) {
        getAllBookings();
      }    
    }, [ user]);


  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        {/* Search */}
        <div className="mb-3 w-72">
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>
        <table className="w-full border-collapse  rounded-md overflow-hidden text-nowrap">
            <thead>
                <tr className="bg-primary/20 text-left text-white">
                    <th className="p-2 font-medium pl-5">User Name</th>
                    <th className="p-2 font-medium">Movie Name</th>
                    <th className="p-2 font-medium">Show Time</th>
                    <th className="p-2 font-medium">Seats</th>
                    <th className="p-2 font-medium">Amount</th>
                </tr>
            </thead>
            <tbody className="text-sm font-light">
                {(searchText ? bookings.filter((item)=> {
                      const q = searchText.toLowerCase();
                      const userName = item?.user?.name || "";
                      const movieTitle = item?.movie?.title || "";
                      const showTime = item ? dateFormat(new Date(`${item.date}T${item.time}:00Z`)) : "";
                      const seatsString = (item.bookedSeats || []).join(', ').toLowerCase().includes(q);
                      return (
                        userName.toLowerCase().includes(q) ||
                        movieTitle.toLowerCase().includes(q) ||
                        showTime.toLowerCase().includes(q) ||
                        seatsString ||
                        String(item.amount).includes(q)
                      );
                    }) : (bookings || [])).map((item, index) => (
                    <tr key={index} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                        <td className="p-2 min-w-45 pl-5">{item.user?.name}</td>
                        <td className="p-2">{item.movie.title}</td>
                        <td className="p-2">{dateFormat(new Date(`${item.date}T${item.time}:00Z`))}</td>
                        <td className="p-2">{item.bookedSeats.join(", ")}</td>
                        <td className="p-2">{currency} {item.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListBookings
