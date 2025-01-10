import { createContext, useState } from "react";

export const UserDataContext = createContext();

const UserContext = (props) => {
  const [user, setUser] = useState({
    email: "",
    fullName: { firstName: "", lastName: "" },
  });
  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
