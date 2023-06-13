import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { JsDateToString, FormDateToJs } from '../../Utils/dateEditor';

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

const Notification = () => {
  const { setIsLoading } = useStore();
  const [notificationData, setNotificationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [notificationTypeFilter, setNotificationTypeFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('notification_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting notification data from database
  const fetchNotificationtData = async () => {
    try {
      setIsLoading(true);
      let response = await axios().get(`/api/v1/app/notification`);
      let notifications = response.data.notifications.map((d) => {
        d.notification_delivery_time = JsDateToString(
          d.notification_delivery_time
        );
        return d;
      });
      setNotificationData(notifications);
      console.log(notifications);
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
    fetchNotificationtData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempNotificationData = notificationData;

    // filtering according to notification type
    const tempNotificationTypeFilteredData = tempNotificationData.filter(
      (data) => {
        switch (notificationTypeFilter) {
          case 'info':
            if (data.notification_type === 'info') return true;
            else return false;
          case 'promo':
            if (data.notification_type === 'promo') return true;
            else return false;
          case 'update':
            if (data.notification_type === 'update') return true;
            else return false;
          default:
            return true;
        }
      }
    );

    const tempSearchTermFilterData = tempNotificationTypeFilteredData.filter(
      (category) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            category['notification_title']
              .toLowerCase()
              .includes(searchTermFilter.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    );

    setFilteredData(tempSearchTermFilterData);
  }, [notificationData, notificationTypeFilter, searchTermFilter]);

  // sorting searchTermFilteredData according to sortingOn and sortingMethod
  useEffect(() => {
    const tempFilteredData = filteredData;

    const asc = (a, b) => {
      if (
        String(a[sortingOn]).toLowerCase() > String(b[sortingOn]).toLowerCase()
      )
        return 1;
      else if (
        String(a[sortingOn]).toLowerCase() < String(b[sortingOn]).toLowerCase()
      )
        return -1;
      else return 0;
    };
    const des = (a, b) => {
      if (
        String(a[sortingOn]).toLowerCase() < String(b[sortingOn]).toLowerCase()
      )
        return 1;
      else if (
        String(a[sortingOn]).toLowerCase() > String(b[sortingOn]).toLowerCase()
      )
        return -1;
      else return 0;
    };

    tempFilteredData.sort(sortingMethod ? asc : des);
    setSortedData(tempFilteredData);
  }, [filteredData, sortingMethod, sortingOn]);

  // paginating sortedData accordint to currentPage and rowsPerPage
  useEffect(() => {
    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    setPaginatedData(sortedData.slice(indexOfFirstUser, indexOfLastUser));
  }, [currentPage, sortedData, rowsPerPage, sortingMethod]);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const totalPage = Math.ceil(sortedData.length / rowsPerPage);
    if (currentPage < totalPage) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  <i className="nav-icon fa fa-bell me-2" />
                  Notification
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  {/* <li className="breadcrumb-item">App</li> */}
                  <li className="breadcrumb-item active">Notification</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for notification title"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageNotificationModal
                  fetchNotificationtData={fetchNotificationtData}
                />
              </div>
              <div className="card-body" style={{ overflow: 'auto' }}>
                <table
                  className="table table-hover"
                  style={{ minWidth: '840px' }}
                >
                  <thead className="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th
                        scope="col"
                        className="w-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('notification_delivery_time');
                        }}
                      >
                        Date / Time
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={notificationTypeFilter}
                          onChange={(e) => {
                            setNotificationTypeFilter(e.target.value);
                          }}
                        >
                          <option value="">Type</option>
                          <option value="info">Information</option>
                          <option value="promo">Promotion</option>
                          <option value="update">Update</option>
                        </select>
                      </th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchNotificationtData={fetchNotificationtData}
                      paginatedData={paginatedData}
                      currentPage={currentPage}
                      rowsPerPage={rowsPerPage}
                    />
                  </tbody>
                </table>
              </div>
              <div className="card-footer clearfix d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-primary me-2"
                  onClick={prevPage}
                >
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </button>
                <input
                  type="text"
                  disabled={true}
                  className="form-control"
                  style={{ width: '100px', textAlign: 'center' }}
                  value={`${currentPage}/${
                    Math.ceil(notificationData.length / rowsPerPage) || 1
                  }`}
                  readOnly={true}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary ms-2"
                  onClick={nextPage}
                >
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;

const TableContent = ({
  fetchNotificationtData,
  paginatedData,
  currentPage,
  rowsPerPage,
}) => {
  return (
    <>
      {paginatedData.length === 0 ? (
        <tr>
          <td colSpan="8" className="text-center">
            No data
          </td>
        </tr>
      ) : (
        paginatedData.map((data, index) => {
          return (
            <tr key={data._id}>
              <th scope="row">
                {currentPage * rowsPerPage - rowsPerPage + index + 1}
              </th>
              <td>
                <div style={{ fontSize: '70%', color: '#775da8' }}>
                  {data.notification_delivery_time}
                </div>
                <div>{data.notification_title}</div>
              </td>
              <td>
                {data.notification_type === 'info' && 'Information'}
                {data.notification_type === 'promo' && 'Promotion'}
                {data.notification_type === 'update' && 'Update'}
              </td>
              <td>
                <ManageNotificationModal
                  data={data}
                  fetchNotificationtData={fetchNotificationtData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageNotificationModal = ({ data, fetchNotificationtData }) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    notification_type: 'info',
    notification_title: '',
    notification_delivery_time: new Date(),
    notification_url: '',
  };

  const [localData, setLocalData] = useState(initialLocalData);
  //   const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddNotification = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/app/notification`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Notification added',
      });
      setLocalData(initialLocalData);
      CloseButton.current.click();
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

  const handleUpdateNotification = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/app/notification/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Notification updated',
      });
      fetchNotificationtData();
      CloseButton.current.click();
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

  const handleDeleteNotification = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This notification will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/app/notification/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Notification deleted',
          });
          setTimeout(function () {
            fetchNotificationtData();
          }, 500);
          CloseButton.current.click();
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: 'error',
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
      <button
        type="button"
        className="btn btn-dark ms-2 d-flex align-items-center"
        data-toggle="modal"
        data-target={data ? `#${data._id}` : '#add-notification-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Notification
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-notification-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Notification</> : <>Add Notification</>}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={CloseButton}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="notification_title" className="form-label mt-2">
                Notification Title
              </label>
              <input
                type="text"
                className="form-control"
                id="notification_title"
                value={localData.notification_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    notification_title: e.target.value,
                  })
                }
              />

              <label htmlFor="notification_type" className="form-label mt-2">
                Notification Type
              </label>
              <select
                className="form-select w-100"
                id="notification_type"
                value={localData.notification_type}
                onChange={(e) => {
                  setLocalData({
                    ...localData,
                    notification_type: e.target.value,
                  });
                }}
              >
                <option value="info">Information</option>
                <option value="promo">Promotion</option>
                <option value="update">Update</option>
              </select>
              <label
                htmlFor="notification_delivery_time"
                className="form-label mt-2"
              >
                Notification Date/Time (
                {JsDateToString(localData.notification_delivery_time)})
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="notification_delivery_time"
                // value={localData.notification_delivery_time}
                onChange={(e) => {
                  setLocalData({
                    ...localData,
                    notification_delivery_time: FormDateToJs(e.target.value),
                  });
                }}
              />
            </div>
            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteNotification}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUpdateNotification}
                  >
                    Save changes
                  </button>
                </>
              ) : (
                <>
                  {/* Add New */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddNotification}
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
