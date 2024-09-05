import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import PulseLoader from "react-spinners/PulseLoader";
import { Empty } from "antd";
import "../styles/buttonStyles.css";

export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
    minArea: 0,
    maxArea: Infinity,
    minYearBuilt: 0,
    maxYearBuilt: new Date().getFullYear(),
    propertyType: "all",
    amenities: "",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListing] = useState([]);
  // console.log(listings);

  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const typeFormUrl = urlParams.get("type");
    const parkingFormUrl = urlParams.get("parking");
    const furnishedFormUrl = urlParams.get("furnished");
    const offerFormUrl = urlParams.get("offer");
    const sortFormUrl = urlParams.get("sort");
    const orderFormUrl = urlParams.get("order");
    const minAreaFormUrl = urlParams.get("minArea");
    const maxAreaFormUrl = urlParams.get("maxArea");
    const minYearBuiltFormUrl = urlParams.get("minYearBuilt");
    const maxYearBuiltFormUrl = urlParams.get("maxYearBuilt");
    const propertyTypeFormUrl = urlParams.get("propertyType");
    const amenitiesFormUrl = urlParams.get("amenities");

    if (
      searchTermFormUrl ||
      typeFormUrl ||
      parkingFormUrl ||
      furnishedFormUrl ||
      offerFormUrl ||
      sortFormUrl ||
      orderFormUrl ||
      minAreaFormUrl ||
      maxAreaFormUrl ||
      minYearBuiltFormUrl ||
      maxYearBuiltFormUrl ||
      propertyTypeFormUrl ||
      amenitiesFormUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFormUrl || "",
        type: typeFormUrl || "all",
        parking: parkingFormUrl === "true" ? true : false,
        furnished: furnishedFormUrl === "true" ? true : false,
        offer: offerFormUrl === "true" ? true : false,
        sort: sortFormUrl || "createdAt",
        order: orderFormUrl || "desc",
        minArea: minAreaFormUrl || 0,
        maxArea: maxAreaFormUrl || Infinity,
        minYearBuilt: minYearBuiltFormUrl || 0,
        maxYearBuilt: maxYearBuiltFormUrl || new Date().getFullYear(),
        propertyType: propertyTypeFormUrl || "all",
        amenities: amenitiesFormUrl || "",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/listing/get?${searchQuery}`);

      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  //Changes on Form
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata({
        ...sidebardata,
        type: id,
      });
    } else if (type === "checkbox") {
      setSidebardata({
        ...sidebardata,
        [id]: checked,
      });
    } else {
      setSidebardata({
        ...sidebardata,
        [id]: value,
      });
    }

    if (id === "sort_order") {
      const sort = value.split("_")[0] || "created_at";
      const order = value.split("_")[1] || "desc";
      setSidebardata({
        ...sidebardata,
        sort,
        order,
      });
    }
  };

  // Submitting Form
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    urlParams.set("minArea", sidebardata.minArea);
    urlParams.set("maxArea", sidebardata.maxArea);
    urlParams.set("minYearBuilt", sidebardata.minYearBuilt);
    urlParams.set("maxYearBuilt", sidebardata.maxYearBuilt);
    urlParams.set("propertyType", sidebardata.propertyType);
    urlParams.set("amenities", sidebardata.amenities);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);

      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await res.json();

      if (data.length < 9) {
        setShowMore(false);
      }

      setListing([...listings, ...data]);
    } catch (error) {
      console.error("An error occurred while fetching more listings.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="border rounded-lg p-3 w-full"
              type="text"
              id="searchTerm"
              placeholder="Search..."
              onChange={handleChange}
              value={sidebardata.searchTerm}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Type:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Amenities:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* New Fields for Area, Year Built, and Property Type */}
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Area (sq ft):</label>

            <input
              className="border rounded-lg p-3 w-[125px]"
              type="number"
              id="minArea"
              placeholder="Min Area"
              onChange={handleChange}
              value={sidebardata.minArea}
            />
            <input
              className="border rounded-lg p-3 w-[125px]"
              type="number"
              id="maxArea"
              placeholder="Max Area"
              onChange={handleChange}
              value={sidebardata.maxArea}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Property Type:</label>

            <select
              className="border rounded-lg p-3"
              id="propertyType"
              onChange={handleChange}
              value={sidebardata.propertyType}
            >
              <option value="all">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3 "
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button
            type="submit"
            className="custombutton bg-[#102376bd] uppercase text-white p-3 rounded-lg hover:opacity-95"
          >
            Search
          </button>

        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold p-3 border-b text-slate-700 md:mt-4">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <Empty
              className="w-full lg:text-4xl text-2xl custom-empty-height"
              description="No Listings Found!"
              style={{ height: "400px" }}
            />
          )}
          {loading && (
            <p className="text-2xl text-slate-700 text-center w-full">
              <PulseLoader color="#1d2964" loading margin={2} size={15} />
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 text-center w-full p-7 hover:underline"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
