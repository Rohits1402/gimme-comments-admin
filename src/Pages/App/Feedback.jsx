import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { JsDateToString } from '../../Utils/dateEditor';
import { useNavigate } from 'react-router-dom';

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

const default_profile_image =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png';

const Feedback = () => {
  const { setIsLoading } = useStore();
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('updatedAt');
  const [sortingMethod, setSortingMethod] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting welcome screen data from database
  const fetchFeedbackData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/app/feedback`);
      let feedbacks = response.data.feedbacks.map((d) => {
        d.updatedAt = JsDateToString(d.updatedAt);
        return d;
      });
      setFeedbackData(feedbacks);
      console.log(feedbacks);
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
    fetchFeedbackData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempCourseCategoriesData = feedbackData;
    const tempSearchTermFilterData = tempCourseCategoriesData.filter(
      (category) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            category['feedback_description']
              .toLowerCase()
              .includes(searchTermFilter.toLowerCase()) ||
            category.feedback_by.name
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
  }, [feedbackData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-bug me-2" />
                  Feedback
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Feedback</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for feedback, user name"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                {/* <ManageFeedbackModal
                  fetchFeedbackData={fetchFeedbackData}
                /> */}
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
                          setSortingOn('updatedAt');
                        }}
                      >
                        Date / Time
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th
                        scope="col"
                        className="w-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('feedback_value');
                        }}
                      >
                        <div className="d-flex align-items-center">
                          Rating
                          <i className="ms-2 fa fa-sort" aria-hidden="true" />
                        </div>
                      </th>
                      <th scope="col">Info</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchFeedbackData={fetchFeedbackData}
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
                    Math.ceil(feedbackData.length / rowsPerPage) || 1
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

export default Feedback;

const TableContent = ({
  fetchFeedbackData,
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
                  {data.feedback_by.name} | {data.updatedAt}
                </div>
                <div>{data.feedback_description}</div>
              </td>
              <td>
                <div className="text-center">
                  {Array.apply(null, { length: data.feedback_value }).map(
                    (e, i) => (
                      <i
                        key={i}
                        className="fa fa-star text-yellow"
                        aria-hidden="true"
                      />
                    )
                  )}
                </div>
              </td>
              <td>
                <ManageFeedbackModal
                  data={data}
                  fetchFeedbackData={fetchFeedbackData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageFeedbackModal = ({ data, fetchFeedbackData }) => {
  const CloseButton = useRef();
  const navigate = useNavigate();

  const { setIsLoading } = useStore();
  const initialLocalData = {
    feedback_description: '',
    feedback_value: '',
    feedback_by: {},
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleDeleteFeedback = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This feedback will get permanently deleted</h6>',
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
            title: 'Feedback deleted',
          });
          setTimeout(function () {
            fetchFeedbackData();
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
        className="btn btn-primary ms-2 d-flex align-items-center"
        data-toggle="modal"
        data-target={`#${data._id}`}
      >
        <i className="fa fa-info-circle" aria-hidden="true" />
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-feedback-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Feedback{' '}
                {Array.apply(null, { length: data.feedback_value }).map(
                  (e, i) => (
                    <i
                      key={i}
                      className="fa fa-star text-yellow"
                      aria-hidden="true"
                    />
                  )
                )}
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
              <label htmlFor="feedback_by" className="form-label mt-2">
                Feedback By
              </label>
              <div
                className="d-flex bg-light-subtle p-2 my-2 rounded-2"
                // style={{ cursor: 'pointer' }}
                // onClick={() => navigate(`/customers/${data.feedback_by._id}`)}
              >
                <img
                  src={data.feedback_by.profile_image || default_profile_image}
                  alt="profile"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '10px',
                  }}
                />
                <div>
                  <div className="text-bold">{data.feedback_by.name}</div>
                  <div>{data.feedback_by.email}</div>
                </div>
              </div>
              <label htmlFor="feedback_description" className="form-label mt-2">
                Feedback Title
              </label>
              <textarea
                type="text"
                className="form-control"
                id="feedback_description"
                value={localData.feedback_description}
                disabled={true}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger me-auto"
                onClick={handleDeleteFeedback}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
