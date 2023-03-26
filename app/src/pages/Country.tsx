import Header from "../components/Header";
import Footer from "../components/footer";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TypeCountry } from "../types/TypeCountry";
import axios from "axios";

const Country = () => {
  const [country, setCountry] = useState<TypeCountry>();
  const params = useParams();

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha?codes=${params.countryCode}`)
      .then((res) => {
        const data = res.data;
        setCountry(data[0]);
        console.log(data[0]);
      });
  }, []);

  const contentRef = useRef<HTMLElement | null>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-max w-full flex flex-col bg-green-50">
      <Header />
      {country ? (
        <div>
          <div>
            <section>
              <div className="flex justify-center border-b border-green-700 overflow-hidden">
                <div className="flex flex-col space-y-8 md:flex-row max-w-[85rem] w-[85rem] justify-between p-4 py-12 md:p-16 md:py-24">
                  <div className="">
                    <span>
                      <img
                        src={`https://flagcdn.com/256x192/${params.countryCode}.webp`}
                        alt="earth"
                        className="h-28 md:h-full"
                      />
                    </span>
                  </div>
                  <div className="z-10 space-y-4 md:space-y-8">
                    <p className="font-playfair text-green-900 text-4xl font-bold">
                      <span className="text-5xl md:text-6xl">Welcome</span> to{" "}
                      <br />
                      <span className="text-5xl md:text-6xl text-green-500 drop-shadow-md">
                        {country.name.common}
                      </span>
                    </p>
                    <p className="max-w-[40rem] text-green-900 font-playfair text-xl md:text-2xl drop-shadow-sm">
                      Find all the details about {country.name.common}. it's
                      languages, currency, population and much more.
                    </p>
                    <button
                      className="font-playfair font-bold text-white p-2 px-4 md:p-4 md:px-8 bg-green-900"
                      onClick={() => {
                        scrollToContent();
                      }}
                    >
                      See More
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div>
            <section ref={contentRef}>
              <div className="flex justify-center border-b border-green-700 bg-white">
                <div className="flex flex-col space-y-2 max-w-[85rem] w-[85rem] py-12 md:p-16 md:py-24">
                  <div className="p-4 space-y-2 md:space-y-4 font-playfair">
                    <p className="text-4xl md:text-6xl font-extrabold text-green-900">
                      {country.name.common}
                    </p>
                    <p className="text-2xl md:text-3xl font-extrabold text-green-800">
                      {country.name.official}
                    </p>
                  </div>
                  <div className="p-4 space-y-2 md:space-y-4 font-playfair">
                    <p className="font-bold text-green-900 md:text-2xl">
                      {country.independent ? "Independent" : "Non Independent"}{" "}
                      Country
                    </p>
                  </div>
                  <div>
                    <div className="p-4 space-y-2">
                      <p className="md:text-xl">Languages spoken</p>
                      <div className="flex space-x-2 md:text-2xl font-playfair font-extrabold text-green-900 drop-shadow">
                        {Object.values(country.languages).map(
                          (language, index) => {
                            return <p key={`lang-${index}`}>{language}</p>;
                          }
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="md:text-xl">Borders</p>
                      <div className="flex space-x-2 md:text-2xl font-playfair font-extrabold text-green-900 drop-shadow">
                        {country.borders.map((country, index) => {
                          return <p key={`borders-${index}`}>{country}</p>;
                        })}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="md:text-xl">Population</p>
                      <div className="flex space-x-2 md:text-2xl font-playfair font-extrabold text-green-900 drop-shadow">
                        <p>{country.population}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="md:text-xl">Continents</p>
                      <div className="flex space-x-2 md:text-2xl font-playfair font-extrabold text-green-900 drop-shadow">
                        {country.continents.map((continents, index) => {
                          return <p key={`continent-${index}`}>{continents}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <Footer />
    </div>
  );
};

export default Country;
