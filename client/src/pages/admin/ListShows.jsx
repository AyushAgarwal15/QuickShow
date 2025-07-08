import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import { Trash2Icon } from "lucide-react";
import { toast } from "react-hot-toast";
import SearchBar from "../../components/SearchBar";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteShow = async (showId) => {
    try {
      const { data } = await axios.delete(`/api/show/delete/${showId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success("Show deleted");
        setShows((prev) => prev.filter((s) => s._id !== showId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting");
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        {/* Search */}
        <div className="mb-3 w-72">
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>

        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
              <th className="p-2 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {(searchText ? (shows || []).filter((s)=> {
              const q = searchText.toLowerCase();
              return (
                s.movie.title.toLowerCase().includes(q) ||
                dateFormat(s.showDateTime).toLowerCase().includes(q) ||
                String(s.occupiedSeats).includes(q) ||
                String(s.occupiedSeats * s.showPrice).includes(q)
              );
            }) : (shows || [])).map((show, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                <td className="p-2">
                  {show.occupiedSeats}
                </td>
                <td className="p-2">
                  {currency} {show.occupiedSeats * show.showPrice}
                </td>
                <td className="p-2 text-center">
                  <Trash2Icon
                    className="w-4 h-4 cursor-pointer text-red-400"
                    onClick={() => deleteShow(show._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
