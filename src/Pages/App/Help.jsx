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

const Help = () => {
  const { setIsLoading } = useStore();
  const [helpData, setHelpData] = useState({
    description: '',
  });

  // getting help data from database
  const fetchHelpData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/help`);
      setHelpData(response.data.help);
      console.log(response.data.help);
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
    fetchHelpData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  const handleUpdateHelp = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/help`, {
        description: helpData.description,
      });
      Toast.fire({
        icon: 'success',
        title: 'Help updated',
      });
      fetchHelpData();
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
                  <i className="nav-icon fa fa-life-ring me-2" />
                  Help
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Help</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <h4 className="flex-grow-1">Update Help</h4>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdateHelp}
                >
                  Update
                </button>
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <textarea
                  type="text"
                  rows="5"
                  className="form-control"
                  value={helpData.description}
                  onChange={(e) =>
                    setHelpData({ ...helpData, description: e.target.value })
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

export default Help;
