import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';

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

const default_course_image =
  'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

const Course = () => {
  const location = useLocation();
  const { setIsLoading } = useStore();
  const [coursesData, setCoursesData] = useState([]);
  const [courseCategoriesData, setCourseCategoriesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('course_title');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // setting category according to redirect
  useEffect(() => {
    if (!courseCategoriesData.length || !location.state) return;

    setCourseCategoryFilter(location.state.id);
  }, [courseCategoriesData.length, location.state]);

  // getting course categories data from database
  const fetchCoursesData = async () => {
    try {
      setIsLoading(true);
      const courseResponse = await axios().get(`/api/v1/courses/course/all`);
      setCoursesData(courseResponse.data.courses);

      const categoryResponse = await axios().get(`/api/v1/courses/category`);
      setCourseCategoriesData(categoryResponse.data.categories);
      // console.log(categoryResponse.data.categories);

      console.log(courseResponse.data.courses);
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
    fetchCoursesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to course category filter
    const tempCoursesData = coursesData;

    const tempCourseCategoryFilteredData = tempCoursesData.filter((course) => {
      if (courseCategoryFilter === '') {
        return true;
      } else {
        if (
          course.of_course_category._id
            .toLowerCase()
            .includes(courseCategoryFilter.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      }
    });

    // filtering according to search term filter
    const tempSearchTermFilterData = tempCourseCategoryFilteredData.filter(
      (course) => {
        if (searchTermFilter === '') {
          return true;
        } else {
          if (
            course['course_title']
              .toLowerCase()
              .includes(searchTermFilter.toLowerCase()) ||
            course['course_subtitle']
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
  }, [courseCategoryFilter, coursesData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-book me-2" />
                  Courses
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Courses</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for course"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageCourseModal
                  fetchCoursesData={fetchCoursesData}
                  courseCategoriesData={courseCategoriesData}
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
                          setSortingOn('course_title');
                        }}
                      >
                        Name
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={courseCategoryFilter}
                          onChange={(e) => {
                            setCourseCategoryFilter(e.target.value);
                          }}
                        >
                          <option value="">Category</option>
                          {/* <option value="Male">Male</option> */}
                          {courseCategoriesData.map((category) => {
                            return (
                              <option key={category._id} value={category._id}>
                                {category.category_name}
                              </option>
                            );
                          })}
                        </select>
                      </th>

                      <th scope="col">Series</th>
                      {/* <th scope="col">Quizzes</th> */}
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchCoursesData={fetchCoursesData}
                      paginatedData={paginatedData}
                      currentPage={currentPage}
                      rowsPerPage={rowsPerPage}
                      courseCategoriesData={courseCategoriesData}
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
                    Math.ceil(coursesData.length / rowsPerPage) || 1
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

export default Course;

const TableContent = ({
  fetchCoursesData,
  paginatedData,
  currentPage,
  rowsPerPage,
  courseCategoriesData,
}) => {
  const navigate = useNavigate();

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
              <td className="d-flex align-items-center">
                <img
                  src={data.profile_image || default_course_image}
                  alt="profile"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '5px',
                  }}
                />
                <div>
                  <div className="text-bold">{data.course_title}</div>
                  <div>{data.course_subtitle}</div>
                </div>
              </td>
              <td>{data.of_course_category.category_name}</td>
              <td>
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${data._id}`)}
                  className="btn btn-info py-0 d-flex align-items-center"
                >
                  <i
                    className="fa fa-pencil-square-o me-1"
                    aria-hidden="true"
                  />{' '}
                  {data.course_series.length}
                </button>
              </td>
              {/* <td>
                <button
                  type="button"
                  onClick={() => navigate(`/quiz/${data._id}`)}
                  className="btn btn-info py-0 d-flex align-items-center"
                >
                  <i
                    className="fa fa-pencil-square-o me-1"
                    aria-hidden="true"
                  />{' '}
                  {data.course_quizzes.length}
                </button>
              </td> */}
              <td>
                <ManageCourseModal
                  data={data}
                  fetchCoursesData={fetchCoursesData}
                  courseCategoriesData={courseCategoriesData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageCourseModal = ({
  data,
  fetchCoursesData,
  courseCategoriesData,
}) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    of_course_category: '',
    course_image: '',
    course_title: '',
    course_subtitle: '',
    course_description: '',
  };

  const [localData, setLocalData] = useState(initialLocalData);
  const [localImg, setlocalImg] = useState(null);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddCategory = async () => {
    if (!localData.of_course_category) {
      Toast.fire({
        icon: 'error',
        title: 'Please select Course Category',
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios().post(
        `/api/v1/courses/course/${localData.of_course_category}`,
        localData
      );
      Toast.fire({
        icon: 'success',
        title: 'Course added',
      });
      fetchCoursesData();
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

  const handleUpdateCourse = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/courses/course/${data._id}`, localData);
      Toast.fire({
        icon: 'success',
        title: 'Course updated',
      });
      fetchCoursesData();
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

  const handleUpdateCourseImage = async (e, action) => {
    e.preventDefault();

    let imageData = new FormData();

    if (action === 'delete') {
      imageData.append('course-image', null);
    } else {
      if (!localImg) {
        Toast.fire({ icon: 'warning', title: 'Please provide Image' });
        return;
      }

      imageData.append('course-image', localImg);
    }

    setIsLoading(true);
    try {
      const response = await axios().patch(
        `api/v1/courses/course-image/${localData._id}`,
        imageData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      fetchCoursesData();
      CloseButton.current.click();
      Toast.fire({ icon: 'success', title: response.data.msg });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>All Series, Quizzes, Quiz Scores related to this course will also get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/courses/course/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Course deleted',
          });
          setTimeout(function () {
            fetchCoursesData();
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
        data-target={data ? `#${data._id}` : '#add-course-modal'}
      >
        {data ? (
          <i className="fa fa-cog" aria-hidden="true" />
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Course
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : 'add-course-modal'}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Course</> : <>Add Course</>}
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
              {data ? (
                <>
                  <div>
                    <div style={{ width: '100%', height: '200px' }}>
                      <img
                        src={localData.course_image || default_course_image}
                        alt="course"
                        style={{
                          width: '100%',
                          height: ' 100%',
                          objectFit: 'contain',
                          overflow: 'hidden',
                        }}
                      />
                    </div>
                    <label htmlFor="image">Course Cover Image</label>
                    <input
                      id="image"
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      className="form-control  w-100 mb-2"
                      onChange={(e) => {
                        setlocalImg(e.target.files[0]);
                      }}
                    />

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={(e) => handleUpdateCourseImage(e, 'update')}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={(e) => handleUpdateCourseImage(e, 'delete')}
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-info-subtle d-flex align-items-center px-2 py-1 rounded-2">
                    <i className="fa fa-info-circle me-1" aria-hidden="true" />
                    Upload cover image after adding course.
                  </div>
                </>
              )}

              <label htmlFor="course_title" className="form-label mt-2">
                Course Title
              </label>
              <input
                type="text"
                className="form-control"
                id="course_title"
                value={localData.course_title}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    course_title: e.target.value,
                  })
                }
              />
              <label htmlFor="course_subtitle" className="form-label mt-2">
                Course Subtitle
              </label>
              <input
                type="text"
                className="form-control"
                id="course_subtitle"
                value={localData.course_subtitle}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    course_subtitle: e.target.value,
                  })
                }
              />

              <label htmlFor="course-category" className="form-label mt-2">
                Course Category
              </label>

              <select
                className="form-select w-100"
                id="course-category"
                value={localData.of_course_category}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    of_course_category: e.target.value,
                  })
                }
              >
                <option value="">Category</option>
                {/* <option value="Male">Male</option> */}
                {courseCategoriesData.map((category) => {
                  return (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  );
                })}
              </select>

              <label htmlFor="course_description" className="form-label mt-2">
                Course Description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="course_description"
                value={localData.course_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    course_description: e.target.value,
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
                    onClick={handleDeleteCourse}
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
                    onClick={handleUpdateCourse}
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
                    onClick={handleAddCategory}
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
