import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
            <div className="row justify-content-center mt-5">
              <div className="col-md-12">
                <div className="card">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box">
                        <span className="info-box-icon bg-info elevation-1">
                          <i className="fas fa-th-list" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Categories</span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box">
                        <span className="info-box-icon bg-info elevation-1">
                          <i className="fas fa-th-list" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">
                            Forum Categories
                          </span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-warning elevation-1">
                          <i className="fas fa-users" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Customers</span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-success elevation-1">
                          <i className="fas fa-question-circle" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Forum Questions</span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-success elevation-1">
                          <i className="fas fa-reply" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Forum Replies</span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-danger elevation-1">
                          <i className="fas fa-thumbs-down" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">
                            Unapproved Questions
                          </span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-danger elevation-1">
                          <i className="fas fa-frown" />
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">
                            Unapproved Replies
                          </span>
                          <span className="info-box-number">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
