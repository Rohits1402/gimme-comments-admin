import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../Utils/axios";
import { useStore } from "../../Contexts/StoreContext";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const Website = () => {
  const { setIsLoading } = useStore();
  const [websiteData, setWebsiteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [searchTermFilter, setSearchTermFilter] = useState("");
  const [sortingOn, setSortingOn] = useState("website_title");
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  const rowsPerPage = 20;

  // getting website data from database
  const fetchWebsiteData = async () => {
    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/websites`);

      setWebsiteData(response.data.websites);
      console.log(response.data.websites);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to search term filter
    const tempCourseCategoriesData = websiteData;
    const tempSearchTermFilterData = tempCourseCategoriesData.filter(
      (category) => {
        if (searchTermFilter === "") {
          return true;
        } else {
          if (
            category["website_title"]
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
  }, [websiteData, searchTermFilter]);

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
                  <i className="nav-icon fa fa-map-o me-2" />
                  Websites
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  {/* <li className="breadcrumb-item">App</li> */}
                  <li className="breadcrumb-item active">Websites</li>
                </ol>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for Websites"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <ManageWebsiteModal fetchWebsiteData={fetchWebsiteData} />
              </div>
              <div className="card-body" style={{ overflow: "auto" }}>
                <table
                  className="table table-hover"
                  style={{ minWidth: "840px" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th
                        scope="col"
                        className="w-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn("website_title");
                        }}
                      >
                        Name
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">Install</th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <TableContent
                      fetchWebsiteData={fetchWebsiteData}
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
                  style={{ width: "100px", textAlign: "center" }}
                  value={`${currentPage}/${
                    Math.ceil(websiteData.length / rowsPerPage) || 1
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

export default Website;

const TableContent = ({
  fetchWebsiteData,
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
              <td>{data.website_name}</td>
              <td>
                <AddCodeModal data={data} />
              </td>

              <td>
                <ManageWebsiteModal
                  data={data}
                  fetchWebsiteData={fetchWebsiteData}
                />
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

const ManageWebsiteModal = ({ data, fetchWebsiteData }) => {
  const CloseButton = useRef();
  const { setIsLoading } = useStore();
  const initialLocalData = {
    website_name: "",
    website_description: "",
    website_url: "",
  };

  const [localData, setLocalData] = useState(initialLocalData);

  useEffect(() => {
    if (!data) return;

    setLocalData(data);
  }, [data]);

  const handleAddWebsite = async () => {
    try {
      setIsLoading(true);
      Toast.fire({
        icon: "success",
        title: "Website added",
      });
      setLocalData(initialLocalData);
      CloseButton.current.click();
      setIsLoading(false);
      fetchWebsiteData();
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  // image upload

  const handleUpdateWebsite = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/websites/${data._id}`, localData);
      Toast.fire({
        icon: "success",
        title: "Website updated",
      });

      fetchWebsiteData();
      CloseButton.current.click();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleDeleteWebsite = async () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      html: "<h6>This website will get permanently deleted</h6>",
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: "#D14343",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/websites/${data._id}`);
          Toast.fire({
            icon: "success",
            title: "Website deleted",
          });
          setTimeout(function () {
            fetchWebsiteData();
          }, 500);
          CloseButton.current.click();
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
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
        data-target={data ? `#${data._id}` : "#add-website-modal"}
      >
        {data ? (
          <>
            <i className="fa fa-cog" aria-hidden="true" />
          </>
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Website
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={data ? data._id : "add-website-modal"}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data ? <>Manage Websites</> : <>Details</>}
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
              <label htmlFor="website_title" className="form-label mt-2">
                Website Name
              </label>
              <input
                type="text"
                className="form-control"
                id="website_title"
                value={localData.website_name}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    website_name: e.target.value,
                  })
                }
              />

              <label htmlFor="website_description" className="form-label mt-2">
                Website description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="website_description"
                value={localData.website_description}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    website_description: e.target.value,
                  })
                }
              />

              <label htmlFor="website_location_url" className="form-label mt-2">
                Website URL
              </label>
              <input
                type="text"
                className="form-control"
                id="website_location_url"
                value={localData.website_url}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    website_url: e.target.value,
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
                    onClick={handleDeleteWebsite}
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
                    onClick={handleUpdateWebsite}
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
                    onClick={handleAddWebsite}
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

const AddCodeModal = ({ data }) => {
  const CloseButton = useRef();

  return (
    <>
      <button
        type="button"
        className="btn btn-info ms-2 d-flex align-items-center"
        data-toggle="modal"
        data-target={`#${data._id}-install-website-modal`}
      >
        {data ? (
          <>
            <i class="fa fa-cloud-download" aria-hidden="true"></i>
          </>
        ) : (
          <>
            <i className="fa fa-plus me-1" aria-hidden="true" /> Website
          </>
        )}
      </button>
      <div
        className="modal fade"
        id={`${data._id}-install-website-modal`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Insallation
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
              <ul>
                <li>
                  Add the HTML code in your website where you want to load Gimme
                  Comments comment section.
                </li>
              </ul>
              <label htmlFor="website_title" className="form-label mt-2">
                <button
                  className="btn btn-light text-bold"
                  onClick={() => {
                    navigator.clipboard.writeText(`
                  <div id="gimme-comments-root" data-gimme_comments_website_id="${data._id}"></div><script src="http://153.92.210.82:6969/initialize-gimme-comments.js"></script>`);
                    Toast.fire({
                      icon: "success",
                      title: "Code copied",
                    });
                  }}
                >
                  HTML Code
                  <i className="fa fa-files-o ms-2" aria-hidden="true" />
                </button>
              </label>

              <pre className="bg-dark p-2 border rounded-2">
                <code>
                  &lt;div id="gimme-comments-root"
                  data-gimme_comments_website_id="{data._id}
                  "&gt;&lt;/div&gt;
                  {"\n"}
                  &lt;script
                  src="http://153.92.210.82:6969/initialize-gimme-comments.js"&gt;&lt;/script&gt;
                  {"\n"}
                </code>
              </pre>
            </div>
            <div className="modal-footer">
              {data ? (
                <>
                  {/* Manage */}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
