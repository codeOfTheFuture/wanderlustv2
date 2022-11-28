import type { GetServerSideProps, NextPage } from "next";
import SearchInput from "../components/ui/SearchInput";
import { connectToDatabase } from "../lib/mongodb";
import { Tour, TourResults, User } from "../types/typings";
import Button from "../components/ui/Button";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { useAppDispatch, useAppSelector, wrapper } from "../store";
import { setUser } from "../store/slices/userSlice";
import TourCards from "../components/tour-cards/TourCards";
import { getToursFilter, setTours } from "../store/slices/toursSlice";
import { FormEvent, useEffect, useState } from "react";
import useAddressAutocomplete from "../hooks/useAddressAutocomplete";
import { setSearchQuery } from "../store/slices/searchSlice";
import { setViewPort } from "../store/slices/mapSlice";
import { useRouter } from "next/router";
import Head from "next/head";

const Home: NextPage = () => {
  const { value, handleAddressChange, suggestions } =
    useAddressAutocomplete("");
  // TODO: create type for selectedSuggestion
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(5);
  const toursFilter = useAppSelector(getToursFilter);

  useEffect(() => {
    if (!value) setSelectedSuggestion(null);
  }, [value]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const setZoomLevel = (placeType: string, category: string) => {
    if (placeType === "country") {
      setZoom(2);
    }
    if (placeType === "place") setZoom(10);
    if (placeType === "region") setZoom(6);
    if (placeType === "poi") setZoom(10);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (selectedSuggestion)
      dispatch(setSearchQuery(selectedSuggestion?.place_name as string));

    setZoomLevel(
      selectedSuggestion.place_type[0],
      selectedSuggestion.properties?.category
    );

    dispatch(
      setViewPort({
        center: selectedSuggestion?.center,
        zoom: zoom,
      })
    );
    router.push(`/search/?place_name${selectedSuggestion.place_name}`);
  };

  return (
    <div className="w-full sm:w-5/6 lg:w-3/4 mx-auto">
      <Head>
        <title>
          Wanderlust - Visit National Parks, Historical Places, and Points of
          Interest
        </title>
      </Head>
      <div className="absolute top-0 left-0 bg-mountain-jump bg-no-repeat bg-cover bg-top h-[70vh] w-full"></div>

      <div className="absolute top-0 left-0 bg-black opacity-70 h-[70vh] w-full"></div>

      <div className="relative flex flex-col justify-center md:justify-center items-center h-[70vh] z-10">
        <div className="flex flex-col items-start w-full justify-center gap-2 pl-5 md:pl-0">
          <h1 className="text-4xl md:text-6xl  xl:text-8xl font-semibold text-light-text mt-52 sm:mt-44">
            Zion National Park
          </h1>

          <Button
            color="btn-primary"
            size="btn-lg"
            type="button"
            onClick={() => {
              router.push(`/search`);
            }}>
            Search Map
          </Button>
        </div>
        {/* <SearchInput /> */}

        <form
          onSubmit={handleSearch}
          className="w-full absolute -bottom-[2.4rem] ">
          <SearchInput
            value={value}
            suggestions={suggestions}
            selectedSuggestion={selectedSuggestion}
            setSelectedSuggestion={setSelectedSuggestion}
            handleAddressChange={handleAddressChange}
            setZoomLevel={setZoomLevel}
            comboBoxStyles="flex w-full h-16 sm:h-20 shadow-md"
            comboboxInputStyles="relative w-full h-full pl-10 pr-[8rem] text-xl border border-primary-text focus:outline-none"
          />
        </form>
      </div>

      <section className="w-full my-20">
        <h3 className="text-2xl mb-10">
          {toursFilter.charAt(0).toUpperCase() + toursFilter.slice(1)}
        </h3>
        <TourCards loading={false} />
      </section>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async context => {
    // Get current session
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );

    // Connect to MongoDb
    const { db } = await connectToDatabase();

    // Only runs if session exists and user in redux is null
    if (session && store.getState().user.user == null) {
      const user = (await db
        .collection("users")
        .findOne({ email: session.user?.email })) as User;

      store.dispatch(setUser(JSON.parse(JSON.stringify(user))));
    }

    const page = 1;
    const limit = store.getState().tours.tourResults?.limit;

    const response = await db
      .collection("tours")
      .find({})
      .limit(limit)
      .toArray();
    const tours = (await JSON.parse(JSON.stringify(response))) as Tour[];

    const documentCount = await db.collection("tours").countDocuments();

    const results = {} as TourResults;
    results.currentPage = page;
    results.totalPages = Math.ceil(documentCount / limit);
    results.results = tours;
    results.limit = limit;

    if (results.totalPages > 1) {
      results.next = {
        page: page + 1,
      };
    }

    store.dispatch(setTours(results));

    return {
      props: {},
    };
  });
