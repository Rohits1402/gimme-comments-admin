import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
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

const Customers = () => {
  const navigate = useNavigate();

  const { setIsLoading } = useStore(0);
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [genderFilter, setGenderFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTermFilter, setSearchTermFilter] = useState('');
  const [sortingOn, setSortingOn] = useState('name');
  const [sortingMethod, setSortingMethod] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [usersPerPage, setUsersPerPage] = useState(20);
  const usersPerPage = 20;

  // getting customers data from database
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        setIsLoading(true);
        const response = await axios().get(`/api/v1/auth/admin/profile/`);
        setCustomersData(response.data);
        console.log(response.data);
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
    fetchCustomersData();
  }, [setIsLoading]);

  // FILTERING DATA IN ONE GO
  useEffect(() => {
    // filtering according to genderFilter
    const tempCustomersData = customersData;
    const tempGenderFilteredData = tempCustomersData.filter((user) => {
      switch (genderFilter) {
        case 'Male':
          if (user.gender === 'Male') return true;
          else return false;
        case 'Female':
          if (user.gender === 'Female') return true;
          else return false;
        case 'Others':
          if (user.gender === 'Others') return true;
          else return false;
        default:
          return true;
      }
    });

    // filtering according to roleFilter
    const tempRoleFilteredData = tempGenderFilteredData.filter((user) => {
      switch (roleFilter) {
        case 'user':
          if (user.role === 'user') return true;
          else return false;
        case 'admin':
          if (user.role === 'admin') return true;
          else return false;
        default:
          return true;
      }
    });

    // filtering according to statusFilter
    const tempStatusFilterData = tempRoleFilteredData.filter((user) => {
      switch (statusFilter) {
        case 'true':
          if (user.account_active === true) return true;
          else return false;
        case 'false':
          if (user.account_active === false) return true;
          else return false;
        default:
          return true;
      }
    });

    // filtering according to searchTermFilter
    const tempSearchTermFilterData = tempStatusFilterData.filter((user) => {
      if (searchTermFilter === '') {
        return true;
      } else {
        if (
          user['name'].toLowerCase().includes(searchTermFilter.toLowerCase()) ||
          user['email']
            .toLowerCase()
            .includes(searchTermFilter.toLowerCase()) ||
          String(user['phone_no'])
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
  }, [customersData, genderFilter, roleFilter, searchTermFilter, statusFilter]);

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

  // downloading data in Excel / CSV format
  const handleDownloadData = () => {
    const items = sortedData;

    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    // const header = Object.keys(items[0])
    const header = [
      'name',
      'email',
      'phone_no',
      'gender',
      'role',
      'account_active',
    ];
    const csv = [
      header.join(','), // header row first
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');

    // Create link and download
    var link = document.createElement('a');
    // link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv));
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csv));

    link.setAttribute('download', 'User-Details');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  <i className="nav-icon fas fa-users me-2" />
                  Customers
                </h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Customers</li>
                </ol>
              </div>
            </div>
            {/* <Link to="/customers/:userId">Profile</Link> */}

            <div className="card mt-5">
              <div className="card-header d-flex">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Search for name, email, phone no"
                  autoFocus={true}
                  value={searchTermFilter}
                  onChange={(e) => {
                    setSearchTermFilter(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-dark ms-2 d-flex align-items-center"
                  onClick={handleDownloadData}
                >
                  <i className="fa fa-cloud-download me-1" aria-hidden="true" />
                  Download
                </button>
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
                          setSortingOn('name');
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
                          setSortingOn('email');
                        }}
                      >
                        Email
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th
                        scope="col"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortingMethod(!sortingMethod);
                          setSortingOn('phone_no');
                        }}
                      >
                        Phone no.
                        <i className="ms-2 fa fa-sort" aria-hidden="true" />
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={genderFilter}
                          onChange={(e) => {
                            setGenderFilter(e.target.value);
                          }}
                        >
                          <option value="">Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={roleFilter}
                          onChange={(e) => {
                            setRoleFilter(e.target.value);
                          }}
                        >
                          <option value="">Role</option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </th>
                      <th scope="col">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                          }}
                        >
                          <option value="">Status</option>
                          <option value="true">Active</option>
                          <option value="false">Blocked</option>
                        </select>
                      </th>
                      <th scope="col">Info</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
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
                              {currentPage * usersPerPage -
                                usersPerPage +
                                index +
                                1}
                            </th>
                            <td
                              className="d-flex align-items-center
                            "
                            >
                              <img
                                src={
                                  data.profile_image || default_profile_image
                                }
                                alt="profile"
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  marginRight: '5px',
                                }}
                              />
                              {data.name}
                            </td>
                            <td>{data.email}</td>
                            <td>+{data.phone_no}</td>
                            <td className="text-center">{data.gender}</td>
                            <td className="text-center">
                              {data.role === 'admin' ? (
                                <>
                                  <span className="badge badge-info">
                                    Admin
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="badge badge-info">User</span>
                                </>
                              )}
                            </td>
                            <td className="text-center">
                              {data.account_active === true ? (
                                <>
                                  <span className="badge badge-success">
                                    Active
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="badge badge-danger">
                                    Blocked
                                  </span>
                                </>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/customers/${data._id}`)
                                }
                                className="btn btn-info py-0"
                              >
                                {' '}
                                <i
                                  className="fa fa-info-circle"
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                    Math.ceil(customersData.length / usersPerPage) || 1
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

export default Customers;
