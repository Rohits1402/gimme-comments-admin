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

const Quiz = () => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId } = useParams();
  const { setIsLoading } = useStore();

  const [quizData, setQuizData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('quiz_name');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [usersPerPage, setUsersPerPage] = useState(20);
  const usersPerPage = 20;

  // getting quiz data from database
  const fetchQuizData = async (modalToOpenId) => {
    if (!courseSeriesId) return;
    try {
      setIsLoading(true);
      const response = await axios().get(
        `/api/v1/quizzes/quiz/${courseSeriesId}`
      );

      setQuizData(response.data.quizzes);
      console.log(response.data.quizzes);

      // if (modalToOpenId) {
      //   console.log(modalToOpenId);
      //   const mod = document.getElementById(`#open${modalToOpenId}`);
      //   console.log(mod);
      //   mod.click();
      // }

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
    fetchQuizData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSeriesId]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    const tempQuizData = quizData;

    // filtering according to search term filter
    const tempSearchTermFilterData = tempQuizData.filter((course) => {
      if (searchTermFilter === '') {
        return true;
      } else {
        if (
          course['quiz_name']
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
  }, [quizData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-pie-chart me-2" />
                  Quizzes
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
                  <li className="breadcrumb-item active">Quizzes</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for course quiz"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageCourseModal fetchQuizData={fetchQuizData} />
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
                          setSortingOn('quiz_name');
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
                          setSortingOn('quiz_duration');
                        }}
                      >
                        <div className="d-flex">
                          Duration
                          <i className="ms-2 fa fa-sort" aria-hidden="true" />
                        </div>
                      </th>

                      {/* <th scope="col">Duration</th> */}
                      <th scope="col">Sections</th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchQuizData={fetchQuizData}
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
                    Math.ceil(quizData.length / usersPerPage) || 1
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

export default Quiz;

const TableContent = ({
  fetchQuizData,
  paginatedData,
  currentPage,
  usersPerPage,
}) => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId } = useParams();

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
              <td>{data.quiz_name}</td>
              <td>{data.quiz_duration} min</td>
              {/* <td>
                {data.quiz_sections.reduce(
                  (tot, sec) => (tot += sec.section_duration),
                  0
                )}{' '}
                min
              </td> */}
              <td>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/quiz/${courseId}/${courseSeriesId}/${data._id}`)
                  }
                  className="btn btn-info py-0 d-flex align-items-center"
                >
                  <i
                    className="fa fa-pencil-square-o me-1"
                    aria-hidden="true"
                  />{' '}
                  {data.quiz_sections.length}
                </button>
              </td>
              <td>
                <ManageCourseModal data={data} fetchQuizData={fetchQuizData} />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({ data, fetchQuizData }) => {
  const { courseSeriesId } = useParams();
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    quiz_name: '',
    quiz_description: '',
    quiz_is_free: false,
    quiz_duration: 0,
    break_between_sections: 0,
    show_questions_randomly: false,
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddQuiz = async () => {
    try {
      setIsLoading(true);
      await axios().post(`/api/v1/quizzes/quiz/${courseSeriesId}`, {
        ...localData,
      });
      Toast.fire({
        icon: 'success',
        title: 'Quiz added',
      });
      fetchQuizData();
      // fetchQuizData(res.data.quiz._id);
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

  const handleUpdateQuiz = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/quizzes/quiz/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Quiz updated',
      });
      fetchQuizData();
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

  const handleDeleteQuiz = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>All Quiz sections, question realted to this Quiz will also get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/quizzes/quiz/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Course Series deleted',
          });
          setTimeout(function () {
            fetchQuizData();
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
        // id={data ? `#open${data._id}` : '#open-add-quiz-modal'}
        data-target={data ? `#${data._id}` : '#add-quiz-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Quiz
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-quiz-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Quiz</> : <>Add Quiz</>}
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
              <label htmlFor="quiz_name" className="form-label mt-2">
                Quiz Name
              </label>
              <input
                type="text"
                className="form-control"
                id="quiz_name"
                value={localData.quiz_name}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    quiz_name: e.target.value,
                  })
                }
              />
              <label htmlFor="quiz_description" className="form-label mt-2">
                Quiz Description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="quiz_description"
                value={localData.quiz_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    quiz_description: e.target.value,
                  })
                }
              />
              <div className="row">
                <div className="col-12 col-md-6">
                  <label htmlFor="quiz_duration" className="form-label mt-2">
                    Quiz Duration (in min)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quiz_duration"
                    value={localData.quiz_duration}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        quiz_duration: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label
                    htmlFor="break_between_sections"
                    className="form-label mt-2"
                  >
                    Break b/w sections (in min)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="break_between_sections"
                    value={localData.break_between_sections}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        break_between_sections: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <label htmlFor="quiz_is_free" className="form-label mt-2">
                    Is Paid / Free
                  </label>
                  <select
                    className="form-select w-100"
                    id="quiz_is_free"
                    style={{
                      background: localData.quiz_is_free
                        ? '#23d483'
                        : '#ff959e',
                    }}
                    value={localData.quiz_is_free}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        quiz_is_free: e.target.value === 'false' ? false : true,
                      })
                    }
                  >
                    <option value="false">Paid</option>
                    <option value="true">Free</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  {' '}
                  <label
                    htmlFor="show_questions_randomly"
                    className="form-label mt-2"
                  >
                    Show question randomly
                  </label>
                  <select
                    className="form-select w-100"
                    id="show_questions_randomly"
                    style={{
                      background: localData.show_questions_randomly
                        ? '#23d483'
                        : '#ff959e',
                    }}
                    value={localData.show_questions_randomly}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        show_questions_randomly:
                          e.target.value === 'false' ? false : true,
                      })
                    }
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteQuiz}
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
                    onClick={handleUpdateQuiz}
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
                    onClick={handleAddQuiz}
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
