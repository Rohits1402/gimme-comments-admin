import React, { useState, useEffect } from "react";
import { useStore } from "../../Contexts/StoreContext";
import Swal from "sweetalert2";
import axios from "../../Utils/axios";

import InfoNavTab from "./InfoNavTab";
import SettingsNavTab from "./SettingsNavTab";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const default_profile_image =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png";

const ProfileComponent = () => {
  const { setIsLoading } = useStore();
  const [userData, setUserData] = useState({
    profile_image: "",
    name: "",
    gender: "",
    birthday: "",
    email: "",
  });

  const [navTab, setNavTab] = useState(1);

  const fetchProfileData = async () => {
    try {
      const response = await axios().get(`/api/v1/auth/profile`);

      setUserData(response.data.user);
      console.log(response.data.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      Toast.fire({
        icon: "error",
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="row justify-content-center mt-5">
        <div className="col-md-12">
          <div className="mb-5 d-flex align-items-center justify-content-center gap-2 gap-sm-4 flex-wrap">
            <img
              src={userData.profile_image || default_profile_image}
              alt="profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: " 5px 5px 8px -1px #777",
              }}
            />
            <div>
              <strong>{userData.name}</strong>
              <br />
              <small>{userData.email}</small>
            </div>
          </div>
          <nav className="nav nav-pills flex-column flex-sm-row mb-2 bg-body-secondary">
            <button
              className={`flex-sm-fill text-sm-center nav-link ${
                navTab === 1 && "active"
              }`}
              onClick={() => setNavTab(1)}
            >
              Info
            </button>
            <button
              className={`flex-sm-fill text-sm-center nav-link ${
                navTab === 2 && "active"
              }`}
              onClick={() => setNavTab(2)}
            >
              Settings
            </button>
          </nav>

          {navTab === 1 && (
            <InfoNavTab
              userData={userData}
              setUserData={setUserData}
              setIsLoading={setIsLoading}
              fetchProfileData={fetchProfileData}
            />
          )}
          {navTab === 2 && (
            <SettingsNavTab
              userData={userData}
              setUserData={setUserData}
              setIsLoading={setIsLoading}
              fetchProfileData={fetchProfileData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
