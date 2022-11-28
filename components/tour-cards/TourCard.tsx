import React, { FC } from "react";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import { Tour } from "../../types/typings";
// import { HeartIcon, PencilAltIcon } from "@heroicons/react/solid";
import {
  addTourToFavorites,
  removeTourFromFavorites,
  selectUser,
} from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { Rating } from "react-simple-star-rating";

interface Props {
  tour: Tour;
}

const TourCard: FC<Props> = ({ tour }) => {
  const { _id, guideId, title, tourPhotos, price } = tour;

  const user = useAppSelector(selectUser);

  const router: NextRouter = useRouter();
  const dispatch = useAppDispatch();

  const tourPageUrl = `/tour?tour=${_id}`;
  const updateTourUrl = `/update-tour?tour=${_id}`;

  const handleClick = () => {
    if (
      user?._id.toString() === guideId &&
      router.pathname === "/offered-tours"
    ) {
      router.push(updateTourUrl);
    } else {
      router.push(tourPageUrl);
    }
  };

  const tourFavorite =
    user?.favoriteTours.find((t: Tour) => t._id === tour._id) != null;

  return (
    <div
      className="relative flex flex-col justify-end items-center w-full h-[300px] bg-slate-200 cursor-pointer border-2 border-slate-700 shadow-lg hover:shadow-xl rounded-sm px-2"
      onClick={handleClick}>
      {tour.tourPhotos.length > 0 && (
        <Image
          src={tourPhotos[0].secure_url}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="absolute"
        />
      )}

      <div
        className={`${
          tour?.rating ? "justify-between" : "justify-end"
        } flex items-center absolute top-2 w-full px-4`}>
        {tour?.rating ? (
          <div className="flex justify-center items-center w-28 h-8 bg-black rounded-full bg-opacity-60">
            <Rating
              size={20}
              readonly
              initialValue={tour.rating.ratingValue}
              SVGclassName="inline-block"
              className="mb-1"
              allowFraction
            />
          </div>
        ) : null}

        {/* {user?._id.toString() === guideId &&
        router.pathname === "/offered-tours" ? (
          <PencilAltIcon className="w-10 text-black opacity-90 hover:scale-125 transition-all duration-300 ease-in-out" />
        ) : (
          <HeartIcon
            className={`${
              tourFavorite ? "text-error-color" : "text-black opacity-60"
            } w-10  opacity-90 hover:scale-125 transition-all duration-300 ease-in-out`}
            onClick={e => {
              e.stopPropagation();
              if (tourFavorite) {
                dispatch(
                  removeTourFromFavorites({
                    userId: user._id.toString(),
                    tourId: tour._id.toString(),
                  })
                );
              } else {
                dispatch(
                  addTourToFavorites({
                    userId: user?._id.toString() as string,
                    tourId: tour._id.toString(),
                  })
                );
              }
            }}
          />
        )} */}
      </div>

      <div className="flex flex-col items-start w-full mt-4 p-2 z-10 bg-slate-200">
        <h2 className="font-semibold">{title}</h2>
        <p>${price} per person</p>
      </div>
    </div>
  );
};

export default TourCard;
