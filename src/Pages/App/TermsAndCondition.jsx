import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';

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

const TermsAndCondition = () => {
  const { setIsLoading } = useStore();
  const [termsAndConditionData, setTermsAndConditionData] = useState({
    description: '',
  });

  // getting terms and condition data from database
  const fetchTermsAndConditionData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/terms-and-condition`);
      setTermsAndConditionData(response.data.terms_and_condition);
      console.log(response.data.terms_and_condition);
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
    fetchTermsAndConditionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  const handleUpdateTermsAndCondition = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/terms-and-condition`, {
        description: termsAndConditionData.description,
      });
      Toast.fire({
        icon: 'success',
        title: 'Terms and Condition updated',
      });
      fetchTermsAndConditionData();
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
                  <i className="nav-icon fa fa-gavel me-2" />
                  Terms and Condition
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Terms and Condition
                  </li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <h4 className="flex-grow-1">Update Terms and Condition</h4>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdateTermsAndCondition}
                >
                  Update
                </button>
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <textarea
                  type="text"
                  rows="5"
                  className="form-control"
                  value={termsAndConditionData.description}
                  onChange={(e) =>
                    setTermsAndConditionData({
                      ...termsAndConditionData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="card-footer clearfix d-flex justify-content-center"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndCondition;
