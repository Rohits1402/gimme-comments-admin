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

const WelcomeScreen = () => {
  const { setIsLoading } = useStore();
  const [welcomeScreenData, setWelcomeScreenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('screen_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting welcome screen data from database
  const fetchWelcomeScreensData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/welcome-screen`);
      setWelcomeScreenData(response.data.welcomeScreens);
      console.log(response.data.welcomeScreens);
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
    fetchWelcomeScreensData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempCourseCategoriesData = welcomeScreenData;
    const tempSearchTermFilterData = tempCourseCategoriesData.filter(
      (category) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            category['screen_title']
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
  }, [welcomeScreenData, searchTermFilter]);

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
                  <i className="nav-icon fafa fa-phone me-2" />
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
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for welcome screen"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageWelcomeScreenModal
                  fetchWelcomeScreensData={fetchWelcomeScreensData}
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
                          setSortingOn('screen_title');
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
                      fetchWelcomeScreensData={fetchWelcomeScreensData}
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
                    Math.ceil(welcomeScreenData.length / rowsPerPage) || 1
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

export default WelcomeScreen;

const TableContent = ({
  fetchWelcomeScreensData,
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
              <td>{data.screen_title}</td>
              <td>
                <ManageWelcomeScreenModal
                  data={data}
                  fetchWelcomeScreensData={fetchWelcomeScreensData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageWelcomeScreenModal = ({ data, fetchWelcomeScreensData }) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    screen_image: '',
    screen_title: '',
    screen_subtitle: '',
  };

  const [localData, setLocalData] = useState(initialLocalData);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddScreen = async () => {
    try {
      setIsLoading(true);
      const res = await axios().post(`/api/v1/app/welcome-screen`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Welcome Screen added',
      });
      handleImageUpload(res.data.welcomeScreen._id);
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

    formData.append('screen_image', ImageToUpload);

    await axios().patch(
      `/api/v1/app/welcome-screen-image/${idOfDoc}`,
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    fetchWelcomeScreensData();
  };

  const handleUpdateWelcomeScreen = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/app/welcome-screen/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Welcome Screen updated',
      });
      handleImageUpload(data._id);
      fetchWelcomeScreensData();
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

  const handleDeleteWelcomeScreen = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This welcome screen will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/app/welcome-screen/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Welcome Screen deleted',
          });
          setTimeout(function () {
            fetchWelcomeScreensData();
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
        data-target={data ? `#${data._id}` : '#add-welcome-screen-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Screen
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-welcome-screen-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Screen</> : <>Add Screen</>}
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
              <label htmlFor="screen_title" className="form-label mt-2">
                Screen Title
              </label>
              <input
                type="text"
                className="form-control"
                id="screen_title"
                value={localData.screen_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    screen_title: e.target.value,
                  })
                }
              />

              <label htmlFor="screen_subtitle" className="form-label mt-2">
                Screen Subtitle
              </label>
              <textarea
                type="text"
                className="form-control"
                id="screen_subtitle"
                value={localData.screen_subtitle}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    screen_subtitle: e.target.value,
                  })
                }
              />

              <label htmlFor="screen_image" className="form-label mt-2">
                Screen Image
              </label>
              <div className="d-flex gap-2">
                {data && localData.screen_image && (
                  <>
                    <div className="d-flex">
                      <button
                        className="btn btn-info rounded-0"
                        onClick={() =>
                          window.open(localData.screen_image, '_blank')
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
                  id="screen_image"
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
                    onClick={handleDeleteWelcomeScreen}
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
                    onClick={handleUpdateWelcomeScreen}
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
                    onClick={handleAddScreen}
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
