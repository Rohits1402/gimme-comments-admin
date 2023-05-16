import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { useNavigate, useParams } from 'react-router-dom';

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

const CourseSeries = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { setIsLoading } = useStore();

  const [courseSeriesData, setCourseSeriesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('series_name');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [usersPerPage, setUsersPerPage] = useState(20);
  const usersPerPage = 20;

  // getting course categories data from database
  const fetchCourseSeriesData = async () => {
    if (!courseId) return;
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/courses/series/${courseId}`);

      setCourseSeriesData(response.data.series);
      console.log(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
      navigate('/courses');
    }
  };

  useEffect(() => {
    fetchCourseSeriesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    const tempCourseSeriesData = courseSeriesData;

    // filtering according to search term filter
    const tempSearchTermFilterData = tempCourseSeriesData.filter((course) => {
      if (searchTermFilter === '') {
        return true;
      } else {
        if (
          course['series_name']
            .toLowerCase()
            .includes(searchTermFilter.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      }
    });

    setFilteredData(tempSearchTermFilterData);
  }, [courseSeriesData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-line-chart me-2" />
                  Course Series
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/courses">Course</Link>
                  </li>
                  <li className="breadcrumb-item active">Course Series</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for course series"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageCourseModal
                  fetchCourseSeriesData={fetchCourseSeriesData}
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
                          setSortingOn('series_name');
                        }}
                      >
                        Name
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">Duration</th>
                      <th scope="col">Plans</th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchCourseSeriesData={fetchCourseSeriesData}
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
                    Math.ceil(courseSeriesData.length / usersPerPage) || 1
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

export default CourseSeries;

const TableContent = ({
  fetchCourseSeriesData,
  paginatedData,
  currentPage,
  usersPerPage,
}) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

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
              <td>{data.series_name}</td>
              <td>{data.series_duration} min</td>
              <td>
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${courseId}/${data._id}`)}
                  className="btn btn-info py-0 d-flex align-items-center"
                >
                  <i
                    className="fa fa-pencil-square-o me-1"
                    aria-hidden="true"
                  />{' '}
                  {data.course_series_plans.length}
                </button>
              </td>
              <td>
                <ManageCourseModal
                  data={data}
                  fetchCourseSeriesData={fetchCourseSeriesData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({ data, fetchCourseSeriesData }) => {
  const { courseId } = useParams();
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    series_name: '',
    series_duration: 0,
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddCourseSeries = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/courses/series/${courseId}`, {
        ...localData,
      });
      Toast.fire({
        icon: 'success',
        title: 'Course Series added',
      });
      fetchCourseSeriesData();
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

  const handleUpdateCourseSeries = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/courses/series/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Course Series updated',
      });
      fetchCourseSeriesData();
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

  const handleDeleteCourseSeries = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>All Plans related to this course series will also get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/courses/series/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Course Series deleted',
          });
          setTimeout(function () {
            fetchCourseSeriesData();
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
        data-target={data ? `#${data._id}` : '#add-course-series-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Series
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-course-series-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Series {data._id}</> : <>Add Series</>}
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
              <label htmlFor="series_name" className="form-label mt-2">
                Series Name
              </label>
              <input
                type="text"
                className="form-control"
                id="series_name"
                value={localData.series_name}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    series_name: e.target.value,
                  })
                }
              />
              <label htmlFor="series_duration" className="form-label mt-2">
                Series Duration (in minutes)
              </label>
              <input
                type="text"
                className="form-control"
                id="series_duration"
                value={localData.series_duration}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    series_duration: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteCourseSeries}
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
                    onClick={handleUpdateCourseSeries}
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
                    onClick={handleAddCourseSeries}
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
