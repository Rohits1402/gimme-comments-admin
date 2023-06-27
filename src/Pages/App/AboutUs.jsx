import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { JsDateToString } from '../../Utils/dateEditor';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const AboutUs = () => {
  const { setIsLoading } = useStore();
  const [aboutUsData, setAboutUsData] = useState({
    description: '',
  });

  // getting about data from database
  const fetchAboutUsData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/about-us`);
      setAboutUsData(response.data.about_us);
      console.log(response.data.about_us);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  const handleUpdateAboutUs = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/about-us`, {
        description: aboutUsData.description,
      });
      Toast.fire({
        icon: 'success',
        title: 'About Us updated',
      });
      fetchAboutUsData();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  <i className="nav-icon fa fa-info-circle me-2" />
                  About Us
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">About Us</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <h4 className="flex-grow-1">Update About Us</h4>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdateAboutUs}
                >
                  Update
                </button>
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <textarea
                  type="text"
                  rows="5"
                  className="form-control"
                  value={aboutUsData.description}
                  onChange={(e) =>
                    setAboutUsData({
                      ...aboutUsData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="card-footer clearfix d-flex justify-content-end text-dark">
                {aboutUsData.updatedAt && (
                  <>Last Modified : {JsDateToString(aboutUsData.updatedAt)}</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
