import { motion } from "framer-motion";

const Filter = () => {
  return (
    <div className="flex justify-center items-center fixed top-0 left-0 h-screen w-full bg-[#00000080] backdrop-blur-sm z-50 overflow-hidden">
      <motion.div className="fixed md:absolute md:bottom-auto w-full md:w-[40rem] h-96 md:h-[40rem] bg-white" initial={{ bottom: "-100%" }} animate={{ bottom: "0%" }}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-playfair font-extrabold">Filters</p>
            </div>
            <div>
              <button className="p-2 text-white bg-green-900 rounded-full">
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
        </div>
      </motion.div>
    </div>
  );
};

export default Filter;
