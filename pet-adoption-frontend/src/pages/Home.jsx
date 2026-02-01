import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import UserPetCard from "../components/UserPetCard";
import PopupMessage from "../components/PopupMessage";
import Pagination from "../components/Pagination";

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [filterBreed, setFilterBreed] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const limit = 8;

  const fetchPets = async (signal) => {
    setLoading(true);
    try {
      const { data } = await API.get("/pets", {
        signal,
        params: { search, species: filterSpecies, breed: filterBreed, age: filterAge, page, limit },
      });
      console.log("API Response from /pets:", data);
      console.log("First pet data:", data.data?.[0]);
      console.log("Image field check:", {
        hasImage: !!data.data?.[0]?.image,
        hasPhoto: !!data.data?.[0]?.photo,
        imageValue: data.data?.[0]?.image,
        photoValue: data.data?.[0]?.photo
      });
      setPets(data.data || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      if (err.name !== "CanceledError") {
        const errorMessage = err.response?.data?.msg || err.message || "Failed to fetch pets";
        setPopup({ open: true, message: errorMessage, severity: "error" });
        setPets([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchPets(controller.signal);
    return () => controller.abort();
  }, [search, filterSpecies, filterBreed, filterAge, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name or breed"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 when searching
              }}
              className="flex-1 px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-0"
            />
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={filterSpecies}
                onChange={(e) => {
                  setFilterSpecies(e.target.value);
                  setPage(1); // Reset to page 1 when filtering
                }}
                className="px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white min-w-0 flex-shrink-0"
              >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>

              <select
                value={filterBreed}
                onChange={(e) => {
                  setFilterBreed(e.target.value);
                  setPage(1); // Reset to page 1 when filtering
                }}
                className="px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white min-w-0 flex-shrink-0"
              >
                <option value="">All Breeds</option>
                <option value="Labrador">Labrador</option>
                <option value="Husky">Husky</option>
                <option value="German Shepherd">German Shepherd</option>
                <option value="Golden Retriever">Golden Retriever</option>
                <option value="Bulldog">Bulldog</option>
                <option value="Poodle">Poodle</option>
                <option value="Beagle">Beagle</option>
                <option value="Persian">Persian</option>
                <option value="Siamese">Siamese</option>
                <option value="Maine Coon">Maine Coon</option>
              </select>

              <select
                value={filterAge}
                onChange={(e) => {
                  setFilterAge(e.target.value);
                  setPage(1); // Reset to page 1 when filtering
                }}
                className="px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white min-w-0 flex-shrink-0"
              >
                <option value="">All Ages</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Pet Grid */}
            {pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                {pets?.map((pet) => (
                  <UserPetCard key={pet._id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-500 text-base sm:text-lg mb-4">
                  {search
                    ? "No applications found matching your criteria"
                    : "No adoption applications yet"}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        <PopupMessage
          open={popup.open}
          message={popup.message}
          severity={popup.severity}
          handleClose={() => setPopup({ ...popup, open: false })}
        />
      </div>
    </div>
  );
};

export default Home;
