import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { JsDateToString } from '../../Utils/dateEditor';

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

const UploadImageModal = () => {
  const { setIsLoading } = useStore();
  const [localImg, setlocalImg] = useState(null);

  const CloseButton = useRef();
  const [imageUploads, setImageUploads] = useState([]);

  const fetchImageUploads = async () => {
    setIsLoading(true);
    try {
      const response = await axios().get(`/api/v1/uploads/image`);

      setImageUploads(response.data.images);
      console.log(response.data.images);
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
    fetchImageUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!localImg) {
      Toast.fire({ icon: 'warning', title: 'Please provide Image' });
      return;
    }

    let imageData = new FormData();

    imageData.append('image', localImg);

    setIsLoading(true);
    try {
      const response = await axios().post('/api/v1/uploads/image', imageData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      Toast.fire({ icon: 'success', title: response.data.msg });
      setIsLoading(false);

      fetchImageUploads();
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (ImageId) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This Image will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/uploads/image/${ImageId}`);
          Toast.fire({
            icon: 'success',
            title: 'Image deleted',
          });
          setTimeout(function () {
            fetchImageUploads();
          }, 500);
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
        className="btn btn-success ms-2 d-flex align-items-center"
        data-toggle="modal"
        id="upload-images-modal-button"
        data-target="#upload-images-modal"
      >
        <i className="fa fa-cloud-upload me-1" aria-hidden="true" /> Images
      </button>
      <div
        className="modal fade"
        id="upload-images-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Upload Images
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
              <div className="form-group mb-3">
                <label htmlFor="image" className="d-block">
                  Select Image
                </label>
                <div className="d-flex gap-2">
                  <input
                    id="image"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    className="form-control  w-100"
                    onChange={(e) => {
                      setlocalImg(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success d-flex align-items-center"
                    onClick={handleImageUpload}
                  >
                    <i className="fa fa-cloud-upload me-1" aria-hidden="true" />{' '}
                    Upload
                  </button>
                </div>
              </div>

              <label htmlFor="image" className="d-block">
                Image Uploads
              </label>

              {imageUploads.length === 0 && (
                <>
                  <p className="text-center">No Uploads</p>
                </>
              )}

              {imageUploads.map((img) => {
                return (
                  <>
                    <div
                      key={img._id}
                      className="highlight-on-hover p-1 rounded-2 my-1"
                    >
                      <div>Uploaded on : {JsDateToString(img.createdAt)}</div>
                      <div className="d-flex gap-2 my-1">
                        <button
                          className="btn btn-info rounded-2"
                          onClick={() => window.open(img.image_url, '_blank')}
                        >
                          <div className="d-flex align-items-center">
                            Image
                            <i
                              className="fa fa-file-image-o ms-1"
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                        <input
                          type="text"
                          disabled={true}
                          className="form-control"
                          // style={{ width: '100px', textAlign: 'center' }}
                          value={img.image_url}
                          readOnly={true}
                        />
                        <button
                          className="btn btn-danger rounded-2"
                          onClick={() => handleDeleteImage(img._id)}
                        >
                          <i className="fa fa-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary mr-auto"
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

export default UploadImageModal;
