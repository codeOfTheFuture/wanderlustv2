import React, { FC } from "react";
import TourCard from "./TourCard";
import { TourResults, User } from "../../types/typings";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  fetchOfferedTours,
  getPopularTours,
  getTourDeals,
  getToursCategory,
  getToursFilter,
  getToursStatus,
  getUserFavoriteTours,
  selectTours,
} from "../../store/slices/toursSlice";
import { useRouter } from "next/router";
import { selectUser } from "../../store/slices/userSlice";
// import ReactLoading from "react-loading";
// import Pagination from "./Pagination";

interface Props {
  loading: boolean;
}

const TourCards: FC<Props> = ({ loading }) => {
  const router = useRouter();

  const toursResults = useAppSelector(selectTours) as TourResults;
  const status = useAppSelector(getToursStatus);

  return (
    <div
      className={`${
        router.pathname === "/search" && "justify-between h-[100vh] p-4"
      } flex flex-col w-11/12 sm:w-5/6 lg:w-full mx-auto bg-white relative ${
        (loading || status === "loading") && "overflow-hidden"
      }`}>
      {/* {(loading || status === "loading") && (
        <div className="w-full absolute top-36 flex justify-center items-center z-50">
          <div className="flex justify-center items-center w-40 bg-white rounded-2xl">
            <ReactLoading
              type={"bars"}
              width={100}
              height={100}
              color="#2196f3"
              className="bg-transparent z-50"
            />
          </div>
        </div>
      )} */}
      <div
        className={`grid ${
          router.pathname === "/search"
            ? "lg:grid-cols-2 mt-16"
            : "lg:grid-cols-3 xl:grid-cols-4 xl:h-[632px]"
        } grid-cols-1 md:grid-cols-2 justify-start items-start gap-6 w-full ${
          (status === "loading" || loading) && "opacity-50"
        } `}>
        {toursResults?.results?.map(tour => (
          <TourCard key={tour._id.toString()} tour={tour} />
        ))}
      </div>

      {/* {toursResults.results.length > 0 && <Pagination />} */}
    </div>
  );
};

export default TourCards;
