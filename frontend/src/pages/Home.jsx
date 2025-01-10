import { UBER_LOGO } from "../utils/constants";

const Home = () => {
  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src={UBER_LOGO}
        alt="uber-logo"
      />
      <div className="h-screen w-screen">
        {/* Tracking Component will go here */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          {/* Other Components will go here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
