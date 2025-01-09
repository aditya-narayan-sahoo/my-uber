import { Link } from "react-router-dom";
import { UBER_LIGHT_LOGO, START_BACKGROUND } from "../utils/constants";

const Start = () => {
  return (
    <div>
      <div
        className={`bg-cover bg-center bg-[url(${START_BACKGROUND})] h-screen pt-8 flex justify-between flex-col w-full`}
      >
        <img className="w-16 ml-8" src={UBER_LIGHT_LOGO} alt="uber" />
        <div className="bg-white pb-8 py-4 px-4">
          <h2 className="text-[30px] font-semibold">Get Started with Uber</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
