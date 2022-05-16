import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "./Spinner";

const Slider = () => {
  const {
    documents: listings,
    error,
    isPenging: isLoading,
  } = useCollection("listings", null, ["timestamp", "desc"], 5);

  const navigate = useNavigate();

  if (isLoading) {
    return <Spinner />;
  }

  return <div>Slider</div>;
};
export default Slider;
