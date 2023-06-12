import React, { useState, useEffect, useRef } from 'react';
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

const Event = () => {
  const { setIsLoading } = useStore();
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('event_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [usersPerPage, setUsersPerPage] = useState(20);
  const usersPerPage = 20;

  // getting banner data from database
  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/event`);
      setEventData(response.data.events);
      console.log(response.data.events);
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
    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempCourseCategoriesData = eventData;
    const tempSearchTermFilterData = tempCourseCategoriesData.filter(
      (category) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            category['event_title']
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
  }, [eventData, searchTermFilter]);

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

  // paginating sortedData accordint to currentPage and usersPerPage
  useEffect(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    setPaginatedData(sortedData.slice(indexOfFirstUser, indexOfLastUser));
  }, [currentPage, sortedData, usersPerPage, sortingMethod]);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const totalPage = Math.ceil(sortedData.length / usersPerPage);
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
                  <i className="nav-icon fa fa-map-o me-2" />
                  Event
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  {/* <li className="breadcrumb-item">App</li> */}
                  <li className="breadcrumb-item active">Event</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for banner title"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageEventModal fetchEventData={fetchEventData} />
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
                          setSortingOn('event_title');
                        }}
                      >
                        Title
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchEventData={fetchEventData}
                      paginatedData={paginatedData}
                      currentPage={currentPage}
                      usersPerPage={usersPerPage}
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
                    Math.ceil(eventData.length / usersPerPage) || 1
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

export default Event;

const TableContent = ({
  fetchEventData,
  paginatedData,
  currentPage,
  usersPerPage,
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
                {currentPage * usersPerPage - usersPerPage + index + 1}
              </th>
              <td>{data.event_title}</td>
              <td>
                <ManageEventModal data={data} fetchEventData={fetchEventData} />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageEventModal = ({ data, fetchEventData }) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    event_image: '',
    event_title: '',
    event_delivery_time: new Date(),
    event_description: '',
    event_location: '',
    event_location_name: '',
  };

  const [localData, setLocalData] = useState(initialLocalData);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddEvent = async () => {
    try {
      setIsLoading(true);
      const res = await axios().post(`/api/v1/app/event`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Event added',
      });
      handleImageUpload(res.data.event._id);
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

  // image upload
  const handleImageUpload = async (idOfDoc, deleteImage) => {
    let ImageToUpload = imageData;
    if (deleteImage) {
      ImageToUpload = null;
    } else {
      if (!ImageToUpload) return;
    }

    const formData = new FormData();

    formData.append('event_image', ImageToUpload);

    await axios().patch(`/api/v1/app/event-image/${idOfDoc}`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    fetchEventData();
  };

  const handleUpdateEvent = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/app/event/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Event updated',
      });
      handleImageUpload(data._id);
      fetchEventData();
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

  const handleDeleteEvent = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This event will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/app/event/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Event deleted',
          });
          setTimeout(function () {
            fetchEventData();
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
        data-target={data ? `#${data._id}` : '#add-event-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Event
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-event-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Event</> : <>Add Event</>}
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
              <label htmlFor="event_title" className="form-label mt-2">
                Event Title
              </label>
              <input
                type="text"
                className="form-control"
                id="event_title"
                value={localData.event_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    event_title: e.target.value,
                  })
                }
              />

              <label htmlFor="event_description" className="form-label mt-2">
                Event description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="event_description"
                value={localData.event_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    event_description: e.target.value,
                  })
                }
              />
              <label htmlFor="event_location_name" className="form-label mt-2">
                Event Location Name
              </label>
              <input
                type="text"
                className="form-control"
                id="event_location_name"
                value={localData.event_location_name}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    event_location_name: e.target.value,
                  })
                }
              />
              <label htmlFor="event_location_url" className="form-label mt-2">
                Event Location URL
              </label>
              <input
                type="text"
                className="form-control"
                id="event_location_url"
                value={localData.event_location_url}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    event_location_url: e.target.value,
                  })
                }
              />
              <label htmlFor="event_delivery_time" className="form-label mt-2">
                Event Date/Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="event_delivery_time"
                value={localData.event_delivery_time}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    event_delivery_time: e.target.value,
                  })
                }
              />

              <label htmlFor="event_image" className="form-label mt-2">
                Event Image
              </label>
              <div className="d-flex gap-2">
                {data && localData.event_image && (
                  <>
                    <div className="d-flex">
                      <button
                        className="btn btn-info rounded-0"
                        onClick={() =>
                          window.open(localData.event_image, '_blank')
                        }
                      >
                        <div className="d-flex align-items-center">
                          Image
                          <i
                            className="fa fa-file-image-o ms-1"
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                      <button
                        className="btn btn-danger rounded-0"
                        onClick={() => handleImageUpload(data._id, true)}
                      >
                        <i className="fa fa-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  readOnly
                  id="event_image"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setImageData(e.target.files[0])}
                />
              </div>
            </div>
            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteEvent}
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
                    onClick={handleUpdateEvent}
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
                    onClick={handleAddEvent}
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
