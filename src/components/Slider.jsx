import { useNavigate } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "./Spinner";

import formatMoney from "../utils";

const Slider = () => {
  const { documents: listings, isPenging: isLoading } = useCollection(
    "listings",
    null,
    ["timestamp", "desc"],
    5
  );

  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="swiper-container "
        >
          {listings.map((listing) => (
            <SwiperSlide
              key={listing.id}
              onClick={() =>
                navigate(`/category/${listing.type}/${listing.id}`)
              }
            >
              <div
                style={{
                  background: `url(${listing.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">{listing.name}</p>
                <p className="swiperSlidePrice">
                  {formatMoney(listing.discountedPrice) ??
                    formatMoney(listing.regularPrice)}{" "}
                  {listing.type === "rent" && "/ month"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};
export default Slider;
