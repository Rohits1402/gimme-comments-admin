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

const PrivacyPolicy = () => {
  const { setIsLoading } = useStore();
  const [privacyPolicyData, setPrivacyPolicyData] = useState({
    description: '',
  });

  // getting privacy policy data from database
  const fetchPrivacyPolicyData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/privacy-policy`);
      setPrivacyPolicyData(response.data.privacy_policy);
      console.log(response.data.privacy_policy);
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
    fetchPrivacyPolicyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  const handleUpdatePrivacyPolicy = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/privacy-policy`, {
        description: privacyPolicyData.description,
      });
      Toast.fire({
        icon: 'success',
        title: 'Privacy Policy updated',
      });
      fetchPrivacyPolicyData();
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
                  <i className="nav-icon fa fa-lock me-2" />
                  Privacy Policy
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Privacy Policy</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <h4 className="flex-grow-1">Update Privacy Policy</h4>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdatePrivacyPolicy}
                >
                  Update
                </button>
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <textarea
                  type="text"
                  rows="5"
                  className="form-control"
                  value={privacyPolicyData.description}
                  onChange={(e) =>
                    setPrivacyPolicyData({
                      ...privacyPolicyData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="card-footer clearfix d-flex justify-content-end text-dark">
                {privacyPolicyData.updatedAt && (
                  <>
                    Last Modified :{' '}
                    {JsDateToString(privacyPolicyData.updatedAt)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
