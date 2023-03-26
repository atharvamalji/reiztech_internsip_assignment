import "./index.css";
import "./global.css";

import Header from "./components/Header";
import Filter from "./components/Filter";

import { Link } from "react-router-dom";
import { useState, useEffect, ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import axios, { all } from "axios";

type TypeCountry = {
  name: string;
  alpha2Code: string;
  region: string;
  area: number;
  independent: boolean;
};

const App = () => {
  const url =
    "https://restcountries.com/v2/all?fields=name,region,area,alpha2Code";

  const [countries, setCountries] = useState<TypeCountry[]>([]);
  const [showCountries, setShowCountries] = useState<TypeCountry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isFilter, setIsFilter] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setpostsPerPage] = useState<number>(10);

  const inputQuery = useRef<null | HTMLInputElement>(null);
  const selectType = useRef<null | HTMLSelectElement>(null);
  const selectOrder = useRef<null | HTMLSelectElement>(null);

  const filterBackground = useRef<null | HTMLDivElement>(null);
  const filterContainer = useRef<null | HTMLDivElement>(null);

  // filter selects
  const selectFilterSmallerThanArea = useRef<null | HTMLSelectElement>(null);
  const selectFilterGreaterThanArea = useRef<null | HTMLSelectElement>(null);
  const selectFilterInRegion = useRef<null | HTMLSelectElement>(null);

  const regions = [
    "Asia",
    "Europe",
    "Africa",
    "Oceania",
    "Americas",
    "Polar",
    "Antarctic Ocean",
    "Antarctic",
  ];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = showCountries.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = showCountries.length / postsPerPage;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setCountries(res.data);
        setShowCountries(res.data);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const createList = (data: TypeCountry[]): ReactNode => {
    if (data.length > 0) {
      return (
        <div className="space-y-2">
          {data.map((country, index) => {
            return (
              <div>
                <Link to={`/country/${country.alpha2Code.toLowerCase()}`}>
                  <div
                    key={index}
                    className="flex bg-green-100 shasow-green-300 shadow-sm border border-green-600 rounded overflow-hidden"
                  >
                    <div className="flex items-center p-2 md:p-4 bg-white border-r border-green-900">
                      <span>
                        <img
                          src={`https://flagcdn.com/128x96/${country.alpha2Code.toLowerCase()}.webp`}
                          className="h-8 md:h-16"
                        />
                      </span>
                    </div>
                    <div className="flex-1 p-2 md:p-4 space-y-2 md:space-y-4">
                      <p className="font-bold text-xl">{country.name}</p>
                      <div className="flex space-x-2 md:space-x-4 font-bold text-sm text-green-900">
                        <p className="bg-green-50 p-1 rounded">
                          Region: {country.region}
                        </p>
                        <p className="bg-green-50 p-1 rounded">
                          Area: {country.area}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <p className="font-playfair text-sm text-green-900">
            Sorry no results found for this query...
          </p>
        </div>
      );
    }
  };

  const createLoading = (): ReactNode => {
    return (
      <div className="flex items-center space-x-2">
        <p className="md:text-xl font-playfair">Loading</p>
        <div className="w-max p-2 border-2 border-green-300 border-t-green-700 rounded-full animate-spin"></div>
      </div>
    );
  };

  // pagination functions
  const paginationNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginationPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // searching funtion
  const searchbyTypeName = (query: string) => {
    if (query.length > 0) {
      setShowCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setCurrentPage(1);
    } else {
      setShowCountries(countries);
      setCurrentPage(1);
    }
  };

  const resetSearch = () => {
    if (inputQuery.current) {
      inputQuery.current.value = "";
    }
    if (selectType.current?.value) {
      selectType.current.value = "0";
    }

    if (selectOrder.current?.value) {
      selectOrder.current.value = "0";
    }
    setShowCountries(countries);
    setCurrentPage(1);
  };

  // sorting function
  const sortResultsType = () => {
    const data = [...showCountries];
    switch (selectType.current?.value) {
      case "0":
        setShowCountries(
          selectOrder.current?.value == "0"
            ? data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeName(a, b, 0);
              })
            : data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeName(a, b, 1);
              })
        );
        break;
      case "1":
        setShowCountries(
          selectOrder.current?.value == "0"
            ? data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeRegion(a, b, 0);
              })
            : data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeRegion(a, b, 1);
              })
        );
        break;
      case "2":
        setShowCountries(
          selectOrder.current?.value == "0"
            ? data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeArea(a, b, 0);
              })
            : data.sort((a: TypeCountry, b: TypeCountry): number => {
                return byTypeArea(a, b, 1);
              })
        );
        break;
      default:
        setShowCountries(
          data.sort((a: TypeCountry, b: TypeCountry): number => {
            return byTypeName(a, b, 0);
          })
        );
    }
    setCurrentPage(1);
  };

  const sortResultsOrder = () => {
    const data = [...showCountries];
    setShowCountries(data.reverse());
    setCurrentPage(1);
  };

  const byTypeName = (a: TypeCountry, b: TypeCountry, order: number) => {
    if (order == 0) {
      if (a.name > b.name) {
        return 1;
      } else if (b.name > a.name) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a.name < b.name) {
        return 1;
      } else if (b.name < a.name) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  const byTypeRegion = (a: TypeCountry, b: TypeCountry, order: number) => {
    if (order == 0) {
      if (a.region < b.region) {
        return 1;
      } else if (b.region < a.region) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a.region > b.region) {
        return 1;
      } else if (b.region > a.region) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  const byTypeArea = (a: TypeCountry, b: TypeCountry, order: number) => {
    a.area == undefined ? (a.area = 0) : (a.area = a.area);
    b.area == undefined ? (b.area = 0) : (b.area = b.area);
    if (order == 0) {
      if (a.area > b.area) {
        return 1;
      } else if (b.area > a.area) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a.area < b.area) {
        return 1;
      } else if (b.area < a.area) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  // filtering function
  const resetFilters = () => {
    if (selectFilterGreaterThanArea.current?.value) {
      selectFilterGreaterThanArea.current.value = "default";
    }
    if (selectFilterSmallerThanArea.current?.value) {
      selectFilterSmallerThanArea.current.value = "default";
    }
    if (selectFilterInRegion.current?.value) {
      selectFilterInRegion.current.value = "default";
    }
  };

  const applyFilters = () => {
    let data = [...countries];
    const filterSmallerThan =
      selectFilterSmallerThanArea.current?.value ?? "default";
    const filterGreaterThan =
      selectFilterGreaterThanArea.current?.value ?? "default";
    const filterRegion = selectFilterInRegion.current?.value ?? "default";

    if (filterSmallerThan != "default") {
      data = data.filter(
        (country) => country.area < parseFloat(filterSmallerThan)
      );
    }
    if (filterGreaterThan != "default") {
      data = data.filter(
        (country) => country.area > parseFloat(filterGreaterThan)
      );
    }
    if (filterRegion != "default") {
      data = data.filter((country) => country.region == filterRegion);
    }
    setShowCountries(data);
    setIsFilter(!isFilter);
    resetFilters();
  };

  const contentRef = useRef<HTMLElement | null>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen h-max w-full flex flex-col bg-green-100">
      <Header />
      <section>
        <div className="flex justify-center border-b border-green-700 overflow-hidden">
          <div className="flex relative md:flex-row max-w-[85rem] w-[85rem] justify-between p-4 py-12 md:p-16 md:py-24">
            <div className="z-10 space-y-4 md:space-y-8">
              <p className="font-playfair text-green-900 text-4xl font-bold">
                <span className="text-5xl md:text-6xl">Welcome</span> to <br />
                <span className="text-5xl md:text-6xl text-green-500 drop-shadow-md">
                  See Countries
                </span>
              </p>
              <p className="max-w-[40rem] text-green-900 font-playfair text-xl md:text-2xl drop-shadow-sm">
                Find about all the countries on this beautiful planet. Find
                their names, their region and their area size.
              </p>
              <button
                className="font-playfair font-bold text-white p-2 px-4 md:p-4 md:px-8 bg-green-900"
                onClick={() => {
                  scrollToContent();
                }}
              >
                See Countries{" "}
                <span>
                  <img
                    src="/images/point-down.png"
                    alt=""
                    className="inline-flex h-6"
                  />
                </span>
              </button>
            </div>
            <div className="absolute md:static -right-20 -bottom-[8rem]">
              <span>
                <img src="/images/earth.png" alt="earth" className="" />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section ref={contentRef}>
        <div className="flex justify-center bg-green-50 border-b border-green-700 overflow-hidden">
          <div className="flex flex-col relative max-w-[85rem] w-[85rem] justify-between p-4 py-12 md:p-16 md:py-24 space-y-4 md:space-y-8">
            <div>
              <p className="text-4xl text-green-900 font-playfair font-extrabold">
                Countries
              </p>
            </div>
            <div>
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex w-full">
                    <input
                      type="text"
                      placeholder="Search Countries By Name"
                      className="flex-1 p-4 font-playfair rounded-tl rounded-bl bg-green-100 border border-green-700 text-green-900 outline-none ring-green-300 focus:ring-2 transition duration-300"
                      ref={inputQuery}
                    />
                    <button
                      className="p-4 bg-green-900 text-white rounded-tr rounded-br"
                      onClick={() =>
                        searchbyTypeName(inputQuery.current?.value ?? "")
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    className="p-4 bg-green-900 text-white rounded-full"
                    onClick={() => {
                      setIsFilter(!isFilter);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center w-max rounded border-green-700 bg-green-900">
                    <p className="p-2 text-white">Sort by</p>
                    <select
                      name=""
                      id=""
                      className="bg-green-100 p-2 border border-green-700 appearance-none font-bold"
                      ref={selectType}
                      onChange={() => sortResultsType()}
                    >
                      <option value="0">Name</option>
                      <option value="1">Region</option>
                      <option value="2">Area</option>
                    </select>
                    <select
                      name=""
                      id=""
                      ref={selectOrder}
                      className="bg-green-100 p-2 border-t border-b border-r rounded-tr rounded-br border-green-700 appearance-none font-bold"
                      onChange={() => sortResultsOrder()}
                    >
                      <option value="0">Ascending</option>
                      <option value="1">Descending</option>
                    </select>
                  </div>
                  <div>
                    <button
                      className="p-2 rounded border-green-700 bg-green-900 text-white font-bold"
                      onClick={() => {
                        resetSearch();
                      }}
                    >
                      Reset search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-playfair font-semibold">
                  Showing {currentPage} of{" "}
                  {Math.ceil(showCountries.length / postsPerPage)} pages
                </p>
                <div className="flex space-x-2">
                  <button
                    className={`flex items-center space-x-2 text-sm ${
                      currentPage > 1
                        ? "bg-green-900 text-white"
                        : "bg-slate-300 text-slate-600"
                    } p-1 px-2 rounded`}
                    onClick={() => {
                      paginationPrevious();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 text-sm ${
                      currentPage < totalPages
                        ? "bg-green-900 text-white"
                        : "bg-slate-300 text-slate-600"
                    } p-1 px-2 rounded`}
                    onClick={() => {
                      paginationNext();
                    }}
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                {countries.length > 0
                  ? createList(currentPosts)
                  : createLoading()}
              </div>
            </div>
          </div>
        </div>
      </section>
      <motion.div
        className="justify-center items-center fixed top-0 left-0 h-screen w-full bg-[#00000080] z-50"
        initial={isFilter ? { display: "none" } : { display: "flex" }}
        animate={isFilter ? { display: "flex" } : { display: "none" }}
        transition={isFilter ? { delay: 0 } : { delay: 0.1 }}
        ref={filterBackground}
      >
        <motion.div
          className="absolute md:static w-full md:w-[40rem] h-96 md:h-[40rem] bg-white"
          initial={isFilter ? { bottom: "0%" } : { bottom: "0%" }}
          animate={isFilter ? { bottom: "0%" } : { bottom: "-100%" }}
          transition={{ duration: 0.25 }}
          ref={filterContainer}
        >
          <div className="space-y-4">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="text-3xl font-playfair font-extrabold">Filters</p>
              </div>
              <div>
                <button
                  className="p-2 text-white bg-green-900 rounded-full"
                  onClick={() => {
                    setIsFilter(!isFilter);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <p>Smaller in area than</p>
                <select
                  name=""
                  id=""
                  className="flex-1 p-2 w-full appearance-none bg-green-50 border border-green-700"
                  ref={selectFilterSmallerThanArea}
                >
                  <option value="default">Select</option>
                  {countries.map((country, index) => {
                    return (
                      <option key={`option-st-${index}`} value={country.area}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <p>Greater in are than</p>
                <select
                  name=""
                  id=""
                  className="flex-1 p-2 w-full appearance-none bg-green-50 border border-green-700"
                  ref={selectFilterGreaterThanArea}
                >
                  <option value="default">Select</option>
                  {countries.map((country, index) => {
                    return (
                      <option key={`option-gt-${index}`} value={country.area}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <p>In region </p>
                <select
                  name=""
                  id=""
                  className="flex-1 p-2 w-full appearance-none bg-green-50 border border-green-700"
                  ref={selectFilterInRegion}
                >
                  <option value="default">Select</option>
                  {regions.map((region, index) => {
                    return (
                      <option key={`option-ir-${index}`} value={region}>
                        {region}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-x-2">
                <button
                  className="p-2 md:p-4 text-green-900 border border-green-900"
                  onClick={() => {
                    resetFilters();
                  }}
                >
                  Reset filters
                </button>
                <button
                  className="p-2 md:p-4 text-white bg-green-900"
                  onClick={() => applyFilters()}
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;
