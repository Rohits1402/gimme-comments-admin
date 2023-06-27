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

const initialData = {
  email: '',
  country_code: 0,
  phone_no: 0,
  address: '',
  address_lat: '',
  address_long: '',
};

const ContactUs = () => {
  const { setIsLoading } = useStore();
  const [contactUsData, setContactUsData] = useState(initialData);

  // getting contact us data from database
  const fetchContactUsData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/contact-us`);
      setContactUsData(response.data.contact_us);
      console.log(response.data.contact_us);
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
    fetchContactUsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  const handleUpdateAboutUs = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/contact-us`, contactUsData);
      Toast.fire({
        icon: 'success',
        title: 'Contact Us updated',
      });
      fetchContactUsData();
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
                  <i className="nav-icon fa fa-phone me-2" />
                  Contact Us
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Contact Us</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <h4 className="flex-grow-1">Update Contact Us</h4>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdateAboutUs}
                >
                  Update
                </button>
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="abc@email.com"
                  value={contactUsData.email}
                  onChange={(e) =>
                    setContactUsData({
                      ...contactUsData,
                      email: e.target.value,
                    })
                  }
                />

                <label htmlFor="phone_no" className="form-label mt-2">
                  Phone No
                </label>
                <div className="d-flex">
                  <div class="input-group">
                    <span class="input-group-text" id="basic-addon1">
                      +
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="country_code"
                      style={{ maxWidth: '80px' }}
                      placeholder="XX"
                      value={contactUsData.country_code}
                      onChange={(e) =>
                        setContactUsData({
                          ...contactUsData,
                          country_code: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      className="form-control"
                      id="phone_no"
                      placeholder="XXXXXXXXXX"
                      description
                      value={contactUsData.phone_no}
                      onChange={(e) =>
                        setContactUsData({
                          ...contactUsData,
                          phone_no: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <label htmlFor="address" className="form-label mt-2">
                  Address
                </label>
                <textarea
                  type="text"
                  rows="3"
                  id="address"
                  className="form-control"
                  value={contactUsData.address}
                  onChange={(e) =>
                    setContactUsData({
                      ...contactUsData,
                      address: e.target.value,
                    })
                  }
                />
                <div className="d-flex gap-2">
                  <div className="w-100">
                    <label htmlFor="address_lat" className="form-label mt-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address_lat"
                      value={contactUsData.address_lat}
                      onChange={(e) =>
                        setContactUsData({
                          ...contactUsData,
                          address_lat: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-100">
                    <label htmlFor="address_long" className="form-label mt-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address_long"
                      value={contactUsData.address_long}
                      onChange={(e) =>
                        setContactUsData({
                          ...contactUsData,
                          address_long: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer clearfix d-flex justify-content-end text-dark">
                {contactUsData.updatedAt && (
                  <>Last Modified : {JsDateToString(contactUsData.updatedAt)}</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
