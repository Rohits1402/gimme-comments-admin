import React, { useState, useEffect } from 'react';
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

const Customers = () => {
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
  const [sortingMethod, setSortingMethod] = useState('asc');
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
      if (a[sortingOn].toLowerCase() > b[sortingOn].toLowerCase()) return 1;
      else if (a[sortingOn].toLowerCase() < b[sortingOn].toLowerCase())
        return -1;
      else return 0;
    };
    const des = (a, b) => {
      if (a[sortingOn].toLowerCase() < b[sortingOn].toLowerCase()) return 1;
      else if (a[sortingOn].toLowerCase() > b[sortingOn].toLowerCase())
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
  }, [currentPage, sortedData, usersPerPage]);

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
              <div className="card-body"></div>
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
