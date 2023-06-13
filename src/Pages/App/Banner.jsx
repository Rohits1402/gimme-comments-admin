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

const Banner = () => {
  const { setIsLoading } = useStore();
  const [bannerData, setBannerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('banner_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting banner data from database
  const fetchBannerData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/banner`);
      setBannerData(response.data.banners);
      console.log(response.data.banners);
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
    fetchBannerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempCourseCategoriesData = bannerData;
    const tempSearchTermFilterData = tempCourseCategoriesData.filter(
      (category) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            category['banner_title']
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
  }, [bannerData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-television me-2" />
                  Banner
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  {/* <li className="breadcrumb-item">App</li> */}
                  <li className="breadcrumb-item active">Banner</li>
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
                <ManageBannerModal fetchBannerData={fetchBannerData} />
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
                          setSortingOn('banner_title');
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
                      fetchBannerData={fetchBannerData}
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
                    Math.ceil(bannerData.length / rowsPerPage) || 1
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

export default Banner;

const TableContent = ({
  fetchBannerData,
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
              <td>{data.banner_title}</td>
              <td>
                <ManageBannerModal
                  data={data}
                  fetchBannerData={fetchBannerData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageBannerModal = ({ data, fetchBannerData }) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    banner_title: '',
    banner_image: '',
    banner_url: '',
  };

  const [localData, setLocalData] = useState(initialLocalData);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddBanner = async () => {
    try {
      setIsLoading(true);
      const res = await axios().post(`/api/v1/app/banner`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Banner added',
      });
      handleImageUpload(res.data.banner._id);
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

    formData.append('banner_image', ImageToUpload);

    await axios().patch(`/api/v1/app/banner-image/${idOfDoc}`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    fetchBannerData();
  };

  const handleUpdateBanner = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/app/banner/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Banner updated',
      });
      handleImageUpload(data._id);
      fetchBannerData();
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

  const handleDeleteBanner = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This banner will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/app/banner/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Banner deleted',
          });
          setTimeout(function () {
            fetchBannerData();
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
        data-target={data ? `#${data._id}` : '#add-banner-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Banner
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-banner-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Banner</> : <>Add Banner</>}
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
              <label htmlFor="banner_title" className="form-label mt-2">
                Banner Title
              </label>
              <input
                type="text"
                className="form-control"
                id="banner_title"
                value={localData.banner_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    banner_title: e.target.value,
                  })
                }
              />

              <label htmlFor="banner_url" className="form-label mt-2">
                Banner URL
              </label>
              <textarea
                type="text"
                className="form-control"
                id="banner_url"
                value={localData.banner_url}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    banner_url: e.target.value,
                  })
                }
              />

              <label htmlFor="banner_image" className="form-label mt-2">
                Banner Image
              </label>
              <div className="d-flex gap-2">
                {data && localData.banner_image && (
                  <>
                    <div className="d-flex">
                      <button
                        className="btn btn-info rounded-0"
                        onClick={() =>
                          window.open(localData.banner_image, '_blank')
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
                  id="banner_image"
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
                    onClick={handleDeleteBanner}
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
                    onClick={handleUpdateBanner}
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
                    onClick={handleAddBanner}
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
