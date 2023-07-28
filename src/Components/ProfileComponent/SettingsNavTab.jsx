import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "../../Utils/axios";

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

const SettingsNavTab = ({ userData, setIsLoading, fetchProfileData }) => {
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const updatePassword = async () => {
    const { old_password, new_password, new_password_confirm } = passwordData;

    if (new_password !== new_password_confirm) {
      Toast.fire({ icon: "warning", title: "New password should match" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios().patch(
        "/api/v1/auth/profile/update-password",
        { old_password, new_password }
      );
      setIsLoading(false);
      Toast.fire({ icon: "success", title: response.data.msg });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleAccountDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      html: "<h5>This account will be deleted</h5>",
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: "#D14343",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await axios().patch(
            "/api/v1/auth/profile/delete-profile"
          );
          setIsLoading(false);
          Toast.fire({ icon: "success", title: response.data.msg });
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: error.response.data
              ? error.response.data.msg
              : error.message,
          });
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="oldPass">Old Password</label>
                <input
                  type="password"
                  className="form-control w-100"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  id="oldPass"
                  placeholder="Old Password"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="newPass">New Password</label>
                <input
                  type="password"
                  className="form-control w-100"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  id="newPass"
                  placeholder="New Password"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="confirmPass">Confirm Password</label>
                <input
                  type="password"
                  className="form-control w-100"
                  value={passwordData.new_password_confirm}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirm: e.target.value,
                    })
                  }
                  id="confirmPass"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer clearfix">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => updatePassword()}
          >
            Update
          </button>
        </div>
      </div>

      <div className="card ">
        <div className="card-header bg-danger">
          <h3 className="card-title">Delete Account</h3>
        </div>
        <div className="card-body">
          <p>
            WARNING : By deleting you account, all transactions, exam results,
            user data will be deleted PERMANANTLY.
            <br />
            <br />
            This CANNOT be undone.
          </p>
        </div>
        <div className="card-footer bg-danger-subtle clearfix">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => handleAccountDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsNavTab;
