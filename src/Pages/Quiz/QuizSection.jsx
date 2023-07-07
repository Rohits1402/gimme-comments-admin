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

const QuizSection = () => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId, quizId } = useParams();
  const { setIsLoading } = useStore();

  const [quizSectionData, setQuizSectionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('section_name');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting quiz section data from database
  const fetchQuizSectionData = async () => {
    if (!courseSeriesId || !quizId) return;
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/quizzes/section/${quizId}`);

      setQuizSectionData(response.data.sections);
      console.log(response.data.sections);
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
    fetchQuizSectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSeriesId]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    const tempQuizSectionData = quizSectionData;

    // filtering according to search term filter
    const tempSearchTermFilterData = tempQuizSectionData.filter((course) => {
      if (searchTermFilter === '') {
        return true;
      } else {
        if (
          course['section_name']
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
  }, [quizSectionData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-list me-2" />
                  Sections
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
                  <li className="breadcrumb-item">
                    <Link to={`/quiz/${courseId}/${courseSeriesId}`}>
                      Quizzes
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Sections</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for quiz section"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageCourseModal
                  fetchQuizSectionData={fetchQuizSectionData}
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
                          setSortingOn('section_name');
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
                          setSortingOn('section_duration');
                        }}
                      >
                        <div className="d-flex">
                          Duration
                          <i className="ms-2 fa fa-sort" aria-hidden="true" />
                        </div>
                      </th>

                      {/* <th scope="col">Duration</th> */}
                      <th scope="col">Questions</th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchQuizSectionData={fetchQuizSectionData}
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
                    Math.ceil(quizSectionData.length / rowsPerPage) || 1
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

export default QuizSection;

const TableContent = ({
  fetchQuizSectionData,
  paginatedData,
  currentPage,
  rowsPerPage,
}) => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId, quizId } = useParams();

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
              <td>{data.section_name}</td>
              <td>{data.section_duration} min</td>
              <td>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/quiz/${courseId}/${courseSeriesId}/${quizId}/${data._id}`
                    )
                  }
                  className="btn btn-info py-0 d-flex align-items-center"
                >
                  <i
                    className="fa fa-pencil-square-o me-1"
                    aria-hidden="true"
                  />{' '}
                  {data.quiz_section_questions.length}
                </button>
              </td>
              <td>
                <ManageCourseModal
                  data={data}
                  fetchQuizSectionData={fetchQuizSectionData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({ data, fetchQuizSectionData }) => {
  const { quizId } = useParams();
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    section_name: '',
    section_description: '',
    section_duration: 0,
    questions_to_answer: 0,
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddQuizSection = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/quizzes/section/${quizId}`, {
        ...localData,
      });
      Toast.fire({
        icon: 'success',
        title: 'Quiz Section added',
      });
      fetchQuizSectionData();
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

  const handleUpdateQuizSection = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/quizzes/section/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Quiz Section updated',
      });
      fetchQuizSectionData();
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

  const handleDeleteQuizSection = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>All Section question realted to this Section will also get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/quizzes/section/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Series Section deleted',
          });
          setTimeout(function () {
            fetchQuizSectionData();
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
        data-target={data ? `#${data._id}` : '#add-quiz-section-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Section
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-quiz-section-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Section</> : <>Add Section</>}
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
              <label htmlFor="section_name" className="form-label mt-2">
                Section Name
              </label>
              <input
                type="text"
                className="form-control"
                id="section_name"
                value={localData.section_name}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    section_name: e.target.value,
                  })
                }
              />
              <label htmlFor="section_description" className="form-label mt-2">
                Section Description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="section_description"
                value={localData.section_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    section_description: e.target.value,
                  })
                }
              />
              <label htmlFor="section_duration" className="form-label mt-2">
                Section Duration (in minutes)
              </label>
              <input
                type="number"
                className="form-control"
                id="section_duration"
                value={localData.section_duration}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    section_duration: Number(e.target.value),
                  })
                }
              />
              <label htmlFor="questions_to_answer" className="form-label mt-2">
                Questions to answer
              </label>
              <input
                type="number"
                className="form-control"
                id="questions_to_answer"
                value={localData.questions_to_answer}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    questions_to_answer: Number(e.target.value),
                  })
                }
              />
              <div className="form-text" id="basic-addon4">
                Number of Questions answered by User to be evaluated for marking
                (keep 0 to skip)
              </div>
            </div>

            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteQuizSection}
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
                    onClick={handleUpdateQuizSection}
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
                    onClick={handleAddQuizSection}
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
