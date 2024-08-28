import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard.jsx";
import { FaMapMarkerAlt } from "react-icons/fa";
import heroImage from "../images/heroimage.jpg";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);
  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* {Top section // hero section} */}
      <div
        className="flex sm:flex-row flex-col justify-center items-center p-7 "
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col gap-6 p-28  px-3 max-w-6xl mx-auto flex-1 lg:h-[82vh]">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
           <span className="bounce-animation text-blue-500">Discover</span>
<span className="bounce-animation text-green-500">your</span>
<span className="bounce-animation text-red-500">next</span>
<span className="bounce-animation text-orange-500">amazing</span>
<br />
<span className="bounce-animation text-blue-500">home</span>
<span className="bounce-animation text-green-500">with</span>
<span className="bounce-animation text-red-500">simplicity</span>

          </h1>
          <div className="text-gray-500 text-xs sm:text-sm">
            <span className="bounce-animation">FakeEstate</span>
            <span className="bounce-animation">is</span>
            <span className="bounce-animation">the</span>
            <span className="bounce-animation">best</span>
            <span className="bounce-animation">place</span>
            <span className="bounce-animation">to</span>
            <span className="bounce-animation">find</span>
            <span className="bounce-animation">your</span>
            <span className="bounce-animation">next</span>
            <span className="bounce-animation">perfect</span>
            <span className="bounce-animation">place</span>
            <span className="bounce-animation">to</span>
            <span className="bounce-animation">live</span>
            <br />
            <span className="bounce-animation">We</span>
            <span className="bounce-animation">have</span>
            <span className="bounce-animation">a</span>
            <span className="bounce-animation">wide</span>
            <span className="bounce-animation">range</span>
            <span className="bounce-animation">of</span>
            <span className="bounce-animation">properties</span>
            <span className="bounce-animation">for</span>
            <span className="bounce-animation">you</span>
            <span className="bounce-animation">to</span>
            <span className="bounce-animation">choose</span>
            <span className="bounce-animation">from</span>
          </div>
          <span>
            <Link
              to={"/search"}
              className="text-xs sm:text-sm lg:text-xl text-blue-800 font-bold"
            >
              <span className="animateunderline">Let&apos;s get started...</span>
            </Link>
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex items-center">
            <FaMapMarkerAlt className="location-icon" />
          </div>
        </div>
      </div>

      {/* Slider */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat `,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Different Listing results */}

      <div className="max-w-[1392px] mx-auto p-3 flex flex-col gap-8 my-10 ">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="restunderline text-sm text-blue-800 "
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className=" restunderline text-sm text-blue-800 "
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="restunderline text-sm text-blue-800 "
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
