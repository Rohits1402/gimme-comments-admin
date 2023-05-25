import React, { useState, useEffect } from 'react';
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

const QuizSectionQuestionOption = ({ question_type, questionId }) => {
  const { setIsLoading } = useStore();

  const [optionsData, setOptionsData] = useState([]);

  // getting options data from database
  const fetchOptionsData = async () => {
    if (!questionId) return;

    try {
      setIsLoading(true);
      const response = await axios().get(`/api/v1/quiz/option/${questionId}`);

      setOptionsData(response.data.options);
      console.log(response.data.options);
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
    fetchOptionsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, question_type]);

  if (question_type === 'bool' || question_type === 'essay') return <></>;

  return (
    <>
      <label className="form-label mt-2">Add Options-</label>

      {optionsData.map((op) => {
        return (
          <ManageOption
            key={op._id}
            data={op}
            questionId={questionId}
            fetchOptionsData={fetchOptionsData}
          />
        );
      })}
      <ManageOption
        questionId={questionId}
        fetchOptionsData={fetchOptionsData}
      />
    </>
  );
};

export default QuizSectionQuestionOption;

const ManageOption = ({ data, questionId, fetchOptionsData }) => {
  const { setIsLoading } = useStore();
  const initialOptionsData = {
    option_image: '',
    option_title: '',
    is_correct: false,
  };

  const [localData, setLocalData] = useState(initialOptionsData);
  const [imageData, setImageData] = useState(null);
  const [inEditMode, setInEditMode] = useState(false);

  useEffect(() => {
    if (!data) return;
    setLocalData(data);
  }, [data]);

  const handleAddOption = async () => {
    try {
      setIsLoading(true);
      const res = await axios().post(`/api/v1/quiz/option/${questionId}`, {
        ...localData,
      });
      handleImageUpload(res.data.option._id);
      Toast.fire({
        icon: 'success',
        title: 'Option added',
      });
      fetchOptionsData();
      setIsLoading(false);
      setLocalData(initialOptionsData);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleUpdateOption = async () => {
    try {
      setIsLoading(true);
      await axios().patch(`/api/v1/quiz/option/${data._id}`, localData);
      handleImageUpload(data._id);
      Toast.fire({
        icon: 'success',
        title: 'Option updated',
      });
      fetchOptionsData();
      setIsLoading(false);
      setInEditMode(false);
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.response.data ? error.response.data.msg : error.message,
      });
      setIsLoading(false);
    }
  };

  const handleDeleteOption = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: '<h6>This option will get permanently deleted</h6>',
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#D14343',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios().delete(`/api/v1/quiz/option/${data._id}`);
          Toast.fire({
            icon: 'success',
            title: 'Option deleted',
          });
          setTimeout(function () {
            fetchOptionsData();
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

  // image upload
  const handleImageUpload = async (idOfDoc, deleteImage) => {
    let ImageToUpload = imageData;
    if (deleteImage) {
      ImageToUpload = null;
    } else {
      if (!ImageToUpload) return;
    }

    const formData = new FormData();

    formData.append('option_image', ImageToUpload);

    await axios().patch(`/api/v1/quiz/option-image/${idOfDoc}`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    fetchOptionsData();
  };

  return (
    <>
      <div
        className={`${!data && 'bg-secondary-subtle'} rounded-2 p-2 mt-1`}
        style={{
          backgroundColor: localData.is_correct ? '#b2ffdc' : '#ffdcdf',
        }}
      >
        <textarea
          type="text"
          rows="1"
          className="form-control"
          id="option_title"
          placeholder="Add Option"
          value={localData.option_title}
          disabled={data && !inEditMode}
          onChange={(e) =>
            setLocalData({
              ...localData,
              option_title: e.target.value,
            })
          }
        />
        <div className="d-flex gap-2 mt-2 overflow-auto">
          <select
            className="form-select"
            id="is_correct"
            disabled={data && !inEditMode}
            value={localData.is_correct}
            style={{
              background: localData.is_correct ? '#23d483' : '#ff959e',
            }}
            onChange={(e) => {
              setLocalData({
                ...localData,
                is_correct: e.target.value === 'true' ? true : false,
              });
            }}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>

          {data && localData.option_image && (
            <>
              <div className="d-flex">
                <button
                  className="btn btn-info rounded-0"
                  onClick={() => window.open(localData.option_image, '_blank')}
                >
                  <div className="d-flex align-items-center">
                    Image
                    <i className="fa fa-file-image-o ms-1" aria-hidden="true" />
                  </div>
                </button>
                {inEditMode && (
                  <>
                    <button
                      className="btn btn-danger rounded-0"
                      onClick={() => handleImageUpload(data._id, true)}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {((data && inEditMode) || (!data && !inEditMode)) && (
            <input
              type="file"
              readOnly
              accept="image/*"
              className="form-control"
              onChange={(e) => setImageData(e.target.files[0])}
            />
          )}

          {data ? (
            <>
              {inEditMode ? (
                <>
                  <button
                    className="btn btn-secondary ms-auto"
                    onClick={() => setInEditMode(false)}
                  >
                    <i className="fa fa-times" aria-hidden="true" />
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleUpdateOption}
                  >
                    <i className="fa fa-floppy-o" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-info ms-auto"
                    onClick={() => setInEditMode(true)}
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true" />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteOption}
                  >
                    <i className="fa fa-trash" aria-hidden="true" />
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                className="btn btn-success ms-auto"
                onClick={handleAddOption}
              >
                <i className="fa fa-plus" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
