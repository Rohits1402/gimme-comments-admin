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

const CourseSeriesPlan = () => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId } = useParams();
  const { setIsLoading } = useStore();

  const [courseSeriesPlanData, setCourseSeriesPlanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('plan_description');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting course series plan data from database
  const fetchCourseSeriesPlanData = async () => {
    if (!courseSeriesId) return;
    try {
      setIsLoading(true);
      const response = await axios().get(
        `/api/v1/courses/plan/${courseSeriesId}/ `
      );

      setCourseSeriesPlanData(response.data.plans);
      console.log(response.data.plans);
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
    fetchCourseSeriesPlanData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSeriesId]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    const tempCourseSeriesPlansData = courseSeriesPlanData;

    // filtering according to search term filter
    const tempSearchTermFilterData = tempCourseSeriesPlansData.filter(
      (course) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            course['plan_description']
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
  }, [courseSeriesPlanData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-inr me-2" />
                  Plans
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/courses">Courses</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={`/courses/${courseId}`}>Series</Link>
                  </li>
                  <li className="breadcrumb-item active">Plans</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for course plan description"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageCourseModal
                  fetchCourseSeriesPlanData={fetchCourseSeriesPlanData}
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
                          setSortingOn('plan_description');
                        }}
                      >
                        Name
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th
                        scope="col"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('plan_duration');
                        }}
                      >
                        <div className="d-flex">
                          Duration
                          <i className="ms-2 fa fa-sort" aria-hidden="true" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('plan_discounted_price');
                        }}
                      >
                        <div className="d-flex">
                          Price
                          <i className="ms-2 fa fa-sort" aria-hidden="true" />
                        </div>
                      </th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchCourseSeriesPlanData={fetchCourseSeriesPlanData}
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
                    Math.ceil(courseSeriesPlanData.length / rowsPerPage) || 1
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

export default CourseSeriesPlan;

const TableContent = ({
  fetchCourseSeriesPlanData,
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
              <td>{data.plan_description}</td>
              <td>{data.plan_duration} mo</td>
              <td>
                ₹{data.plan_discounted_price}{' '}
                <span style={{ textDecoration: 'line-through', color: 'grey' }}>
                  ₹{data.plan_original_price}
                </span>
              </td>
              <td>
                <ManageCourseModal
                  data={data}
                  fetchCourseSeriesPlanData={fetchCourseSeriesPlanData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({ data, fetchCourseSeriesPlanData }) => {
  const { courseSeriesId } = useParams();
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    plan_description: '',
    plan_duration: 0,
    plan_original_price: 0,
    plan_discounted_price: 0,
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddCourseSeriesPlan = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/courses/plan/${courseSeriesId}`, {
        ...localData,
      });
      Toast.fire({
        icon: 'success',
        title: 'Course Series added',
      });
      fetchCourseSeriesPlanData();
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

  const handleUpdateCourseSeriesPlan = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/courses/plan/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Course Series Plan updated',
      });
      fetchCourseSeriesPlanData();
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

  const handleDeleteCourseSeriesPlan = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This Plan will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/courses/plan/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Course Series Plan deleted',
          });
          setTimeout(function () {
            fetchCourseSeriesPlanData();
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
        data-target={data ? `#${data._id}` : '#add-course-series-plan-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Plan
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-course-series-plan-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Plan {data._id}</> : <>Add Plan</>}
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
              <label htmlFor="plan_description" className="form-label mt-2">
                Plan Description
              </label>
              <input
                type="text"
                className="form-control"
                id="plan_description"
                value={localData.plan_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    plan_description: e.target.value,
                  })
                }
              />
              <label htmlFor="plan_duration" className="form-label mt-2">
                Plan Duration (in months)
              </label>
              <input
                type="number"
                className="form-control"
                id="plan_duration"
                value={localData.plan_duration}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    plan_duration: Number(e.target.value),
                  })
                }
              />
              <label htmlFor="plan_original_price" className="form-label mt-2">
                Plan Original Price (in ₹)
              </label>
              <input
                type="number"
                className="form-control"
                id="plan_original_price"
                value={localData.plan_original_price}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    plan_original_price: Number(e.target.value),
                  })
                }
              />
              <label
                htmlFor="plan_discounted_price"
                className="form-label mt-2"
              >
                Plan Discounted Price (in ₹)
              </label>
              <input
                type="number"
                className="form-control"
                id="plan_discounted_price"
                value={localData.plan_discounted_price}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    plan_discounted_price: Number(e.target.value),
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
                    onClick={handleDeleteCourseSeriesPlan}
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
                    onClick={handleUpdateCourseSeriesPlan}
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
                    onClick={handleAddCourseSeriesPlan}
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
