import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { useNavigate, useParams } from 'react-router-dom';
import QuizSectionQuestionOption from './QuizSectionQuestionOption';
import UploadQuestionModal from './UploadQuestionModal';

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

const QuizSectionQuestion = () => {
  const navigate = useNavigate();
  const { courseId, courseSeriesId, quizId, sectionId } = useParams();
  const { setIsLoading } = useStore();

  const [quizSectionQuestionData, setQuizSectionQuestionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('question_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting quiz section questions data from database
  const fetchQuizSectionQuestionData = async (modalToOpenId) => {
    if (!courseSeriesId || !quizId || !sectionId) return;
    try {
      setIsLoading(true);
      const response = await axios().get(
        `/api/v1/quizzes/question/${sectionId}`
      );

      setQuizSectionQuestionData(response.data.questions);
      console.log(response.data.questions);

      if (modalToOpenId) {
        setTimeout(() => {
          let mod = document.getElementById(`open-${modalToOpenId}`);
          if (mod) mod.click();
        }, 500);
      }

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
    fetchQuizSectionQuestionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSeriesId]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    const tempQuizSectionQuestionData = quizSectionQuestionData;

    // filtering accordin to question type filter
    const tempQuestionTypeFilteredData = tempQuizSectionQuestionData.filter(
      (ques) => {
        switch (questionTypeFilter) {
          case 'scq':
            if (ques.question_type === 'scq') return true;
            else return false;
          case 'mcq':
            if (ques.question_type === 'mcq') return true;
            else return false;
          case 'bool':
            if (ques.question_type === 'bool') return true;
            else return false;
          case 'essay':
            if (ques.question_type === 'essay') return true;
            else return false;
          default:
            return true;
        }
      }
    );

    // filtering according to search term filter
    const tempSearchTermFilterData = tempQuestionTypeFilteredData.filter(
      (course) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            course['question_title']
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
  }, [questionTypeFilter, quizSectionQuestionData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-graduation-cap me-2" />
                  Questions
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
                  <li className="breadcrumb-item">
                    <Link to={`/quiz/${courseId}/${courseSeriesId}/${quizId}`}>
                      Sections
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Questions</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for section question"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <UploadQuestionModal
                  fetchQuizSectionQuestionData={fetchQuizSectionQuestionData}
                />
                <ManageCourseModal
                  fetchQuizSectionQuestionData={fetchQuizSectionQuestionData}
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
                          setSortingOn('question_title');
                        }}
                      >
                        Name
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={questionTypeFilter}
                          onChange={(e) => {
                            setQuestionTypeFilter(e.target.value);
                          }}
                        >
                          <option value="">Type</option>
                          <option value="scq">Single Choice</option>
                          <option value="mcq">Multiple Choice</option>
                          <option value="bool">True / False</option>
                          <option value="essay">Essay</option>
                        </select>
                      </th>

                      <th
                        scope="col"
                        className="w-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('question_marks');
                        }}
                      >
                        Marks
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>

                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchQuizSectionQuestionData={
                        fetchQuizSectionQuestionData
                      }
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
                    Math.ceil(quizSectionQuestionData.length / rowsPerPage) || 1
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

export default QuizSectionQuestion;

const TableContent = ({
  fetchQuizSectionQuestionData,
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
                Q{currentPage * rowsPerPage - rowsPerPage + index + 1}.
              </th>
              <td>{data.question_title}</td>
              <td>{data.question_type}</td>
              <td>{data.question_marks}</td>
              <td>
                <ManageCourseModal
                  data={data}
                  fetchQuizSectionQuestionData={fetchQuizSectionQuestionData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({ data, fetchQuizSectionQuestionData }) => {
  const { sectionId } = useParams();
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    question_title: '',
    question_answer_explanation: '',
    question_type: 'scq',
    question_duration: 1,
    question_marks: 1,
    question_is_correct: false,
    question_char_limit: 0,
  };

  const [imageData, setImageData] = useState(null);
  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddQuizSectionQuestion = async () => {
    try {
      setIsLoading(true);
      const res = await axios().post(`/api/v1/quizzes/question/${sectionId}`, {
        ...localData,
      });
      Toast.fire({
        icon: 'success',
        title: 'Section Question added',
      });
      fetchQuizSectionQuestionData(res.data.question._id);
      setLocalData({
        ...initialLocalData,
        question_type: localData.question_type,
      });
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

  const handleUpdateQuizSectionQuestion = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/quizzes/question/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Section Question updated',
      });

      // delete options if question_type == 'bool' or 'essay'
      if (
        localData.question_type === 'bool' ||
        localData.question_type === 'essay'
      ) {
        await axios().delete(`/api/v1/quizzes/options/${data._id}`);
      }

      setTimeout(function () {
        fetchQuizSectionQuestionData();
      }, 500);
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
  const handleImageUpload = async (deleteImage) => {
    setIsLoading(true);

    let ImageToUpload = imageData;
    if (deleteImage) {
      ImageToUpload = null;
    } else {
      if (!ImageToUpload) return;
    }

    const formData = new FormData();

    formData.append('question_image', ImageToUpload);

    try {
      await axios().patch(
        `/api/v1/quizzes/question-image/${data._id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      fetchQuizSectionQuestionData();
      Toast.fire({
        icon: 'success',
        title: deleteImage ? 'Image deleted' : 'Image Updated',
      });
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

  const handleDeleteQuizSectionQuestion = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This question will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/quizzes/question/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Section Question deleted',
          });
          setTimeout(function () {
            fetchQuizSectionQuestionData();
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
        id={data ? `open-${data._id}` : 'open-add-quiz-modal'}
        data-target={data ? `#${data._id}` : '#add-quiz-section-question-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Question
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-quiz-section-question-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Question</> : <>Add Question</>}
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
              <label htmlFor="question_title" className="form-label mt-2">
                Question
              </label>
              <input
                type="text"
                className="form-control"
                id="question_title"
                value={localData.question_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    question_title: e.target.value,
                  })
                }
              />

              {data ? (
                <>
                  <label htmlFor="question_image" className="form-label mt-2">
                    Question Image
                  </label>
                  <div className="d-flex gap-2">
                    {data && localData.question_image && (
                      <>
                        <div className="d-flex">
                          <button
                            className="btn btn-info rounded-0"
                            onClick={() =>
                              window.open(localData.question_image, '_blank')
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
                            onClick={() => handleImageUpload(true)}
                          >
                            <i className="fa fa-trash" aria-hidden="true" />
                          </button>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      readOnly
                      id="question_image"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => setImageData(e.target.files[0])}
                    />
                    <button
                      className="btn btn-success ms-auto"
                      onClick={() => handleImageUpload(false)}
                    >
                      <i className="fa fa-cloud-upload" aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-info-subtle rounded-2 p-2 mt-2">
                    Upload Question Image after saving Question
                  </div>
                </>
              )}

              <label
                htmlFor="question_answer_explanation"
                className="form-label mt-2"
              >
                Answer Explanation
              </label>
              <textarea
                type="text"
                className="form-control"
                id="question_answer_explanation"
                value={localData.question_answer_explanation}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    question_answer_explanation: e.target.value,
                  })
                }
              />
              <div className="row">
                <div className="col-12 col-md-4">
                  <label htmlFor="question_type" className="form-label mt-2">
                    Type
                  </label>
                  <select
                    className="form-select w-100"
                    id="question_type"
                    value={localData.question_type}
                    onChange={(e) => {
                      setLocalData({
                        ...localData,
                        question_type: e.target.value,
                      });
                    }}
                  >
                    <option value="scq">Single Choice</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="bool">True / False</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label
                    htmlFor="question_duration"
                    className="form-label mt-2"
                  >
                    Duration (in min)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="question_duration"
                    value={localData.question_duration}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        question_duration: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="question_marks" className="form-label mt-2">
                    Marks
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="question_marks"
                    value={localData.question_marks}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        question_marks: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {localData.question_type === 'bool' && (
                <>
                  <label
                    htmlFor="question_is_correct"
                    className="form-label mt-2"
                  >
                    Question is correct?
                  </label>
                  <select
                    className="form-select w-100"
                    id="question_is_correct"
                    value={localData.question_is_correct}
                    style={{
                      background: localData.question_is_correct
                        ? '#23d483'
                        : '#ff959e',
                    }}
                    onChange={(e) => {
                      setLocalData({
                        ...localData,
                        question_is_correct:
                          e.target.value === 'true' ? true : false,
                      });
                    }}
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                </>
              )}

              {localData.question_type === 'essay' && (
                <>
                  <label
                    htmlFor="question_char_limit"
                    className="form-label mt-2"
                  >
                    Answer character limit
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="question_char_limit"
                    value={localData.question_char_limit}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        question_char_limit: Number(e.target.value),
                      })
                    }
                  />
                </>
              )}

              {data && (
                <QuizSectionQuestionOption
                  question_type={localData.question_type}
                  questionId={data._id}
                />
              )}
              {/* 
              {localData.question_type !== 'essay' &&
                localData.question_options.map((option) => {
                  return (
                    <>
                      <div
                        className="border border-1 rounded-1 d-flex justify-content-start align-items-center p-2 mt-2"
                        style={{
                          backgroundColor: option.is_correct
                            ? '#23d483'
                            : '#ff959e',
                        }}
                      >
                        <div>
                            <img
                              src={option.option_image}
                              alt=""
                              style={{
                                width: '50px',
                                height: '50px',
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(option.option_image, '_blank')}
                            />
                          </div>
                        <p
                          style={{
                            wordBreak: 'break-word',
                            flex: '1',
                            margin: '0 5px',
                          }}
                        >
                          {option.option_title}
                        </p>
                      </div>
                    </>
                  );
                })} */}

              {/* <AddOptions localData={localData} setLocalData={setLocalData} /> */}
            </div>

            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}
                  <button
                    type="button"
                    className="btn btn-danger me-auto"
                    onClick={handleDeleteQuizSectionQuestion}
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
                    onClick={handleUpdateQuizSectionQuestion}
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
                    onClick={handleAddQuizSectionQuestion}
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
