import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import axios from '../../Utils/axios';
import { useStore } from '../../Contexts/StoreContext';
import { useParams } from 'react-router-dom';
import xlsxParser from 'xlsx-parse-json';

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

const UploadQuestionModal = ({ fetchQuizSectionQuestionData }) => {
  const { sectionId } = useParams();
  const { setIsLoading } = useStore();
  const CloseButton = useRef();
  const excelFileRef = useRef();

  const [questionType, setQuestionType] = useState('scq');
  const [excelFileData, setExcelFileData] = useState([]);

  // Excel / CSE File Upload
  const uploadFileToLocal = () => {
    const file = excelFileRef.current.files[0];
    if (!file) {
      Toast.fire({
        icon: 'error',
        title: 'Please select Excel / CSV',
      });
      return;
    }

    let sheetData;
    xlsxParser.onFileSelection(file).then((data) => {
      // setExcelDataLocal(data.Sheet1)
      //   console.log(data.Sheet1);
      sheetData = data.Sheet1;

      // grouping data
      const groupedData = sheetData.reduce((acc, obj) => {
        const property = obj['question_title'];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
      }, {});

      const GroupedQuestion = Object.keys(groupedData).map((key) => {
        return [key, groupedData[key]];
      });

      console.log(GroupedQuestion);
      setExcelFileData(GroupedQuestion);

      // let updatedQuestions = sectionDetails.section_questions;

      // GroupedQuestion.forEach((singleQuestion) => {
      //   let updatedOptions = [];

      //   singleQuestion[1].forEach((singleOption) => {
      //     updatedOptions.push({
      //       key: nanoid(),
      //       option: singleOption.option,
      //       option_explanation: singleOption.option_explanation,
      //       option_image: singleOption.option_image,
      //       is_correct:
      //         String(singleOption.is_correct).toLowerCase() === 'true'
      //           ? true
      //           : false,
      //     });
      //   });

      //   updatedQuestions.push({
      //     key: nanoid(),
      //     question: singleQuestion[1][0].question || '',
      //     question_explanation: singleQuestion[1][0].question_explanation || '',
      //     question_image: singleQuestion[1][0].question_image || '',
      //     question_score: singleQuestion[1][0].question_score || 1,
      //     options: updatedOptions,
      //   });
      // });

      // setSectionDetails({
      //   ...sectionDetails,
      //   section_questions: updatedQuestions,
      // });
    });
  };

  const uploadFileToServer = () => {
    if (!excelFileData.length) {
      Toast.fire({
        icon: 'error',
        title: 'Please preview Excel / CSV first',
      });
      return;
    }

    try {
      // adding question
      excelFileData.forEach(async (questionData) => {
        let questionToAdd = {
          question_image: questionData[1][0].question_image || '',
          question_title: questionData[1][0].question_title || '',
          question_title_hindi: questionData[1][0].question_title_hindi || '',
          // question_answer_explanation:
          //   questionData[1][0].question_answer_explanation || '',
          question_marks: Number(questionData[1][0].question_marks) || 1,
          question_negative_marking:
            Number(questionData[1][0].question_negative_marking) || 0,
          question_type: questionType,
        };

        if (questionType === 'essay')
          questionToAdd.question_char_limit =
            Number(questionData[1][0].question_char_limit) || 0;
        if (questionType === 'bool')
          questionToAdd.question_is_correct =
            questionData[1][0].question_is_correct?.toLowerCase() === 'true'
              ? true
              : false;

        const res = await axios().post(
          `/api/v1/quizzes/question/${sectionId}`,
          questionToAdd
        );

        const questionId = res.data.question._id;

        if (questionType === 'scq' || questionType === 'mcq') {
          questionData[1].forEach(async (optionData) => {
            const optionToAdd = {
              option_image: optionData.option_image || '',
              option_title: optionData.option_title || '',
              option_title_hindi: optionData.option_title_hindi || '',
              is_correct:
                optionData.is_correct?.toLowerCase() === 'true' ? true : false,
            };

            await axios().post(
              `/api/v1/quizzes/option/${questionId}`,
              optionToAdd
            );
          });
        }
      });

      fetchQuizSectionQuestionData();
      Toast.fire({
        icon: 'success',
        title: 'Question added',
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

  const downloadExample = () => {
    const items = ExampleObj[questionType];

    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    // const header = Object.keys(items[0])
    let header = [
      'question_image',
      'question_title',
      'question_title_hindi',
      // 'question_answer_explanation',
      'question_marks',
      'question_negative_marking',
    ];

    if (questionType === 'mcq' || questionType === 'scq') {
      header.push('option_image');
      header.push('option_title');
      header.push('option_title_hindi');
      header.push('is_correct');
    }
    if (questionType === 'essay') {
      header.push('question_char_limit');
    }
    if (questionType === 'bool') {
      header.push('question_is_correct');
    }

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

    link.setAttribute('download', `Questions ${questionType}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-success ms-2 d-flex align-items-center"
        data-toggle="modal"
        id="upload-question-modal-button"
        data-target="#upload-question-modal"
      >
        <i className="fa fa-cloud-upload me-1" aria-hidden="true" /> Question
      </button>
      <div
        className="modal fade"
        id="upload-question-modal"
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
                Upload Question
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
              <label htmlFor="question_type" className="form-label mt-2">
                Question Type
              </label>
              <div className="d-flex gap-2">
                <select
                  className="form-select w-100"
                  id="question_type"
                  value={questionType}
                  onChange={(e) => {
                    setQuestionType(e.target.value);
                    setExcelFileData([]);
                  }}
                >
                  <option value="scq">Single Choice</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="bool">True / False</option>
                  <option value="essay">Essay</option>
                </select>
                <button className="btn btn-dark" onClick={downloadExample}>
                  Example
                </button>
              </div>

              <label htmlFor="excel_file" className="form-label mt-2">
                Upload CSV / Excel
              </label>

              <div className="d-flex gap-2">
                <input
                  type="file"
                  id="excel_file"
                  className="form-control"
                  readOnly
                  ref={excelFileRef}
                />
                <button className="btn btn-dark" onClick={uploadFileToLocal}>
                  Preview
                </button>
              </div>
              {excelFileData.length > 0 && (
                <>
                  <label
                    htmlFor="excel_file_preview"
                    className="form-label mt-2"
                  >
                    Preview Of Excel / CSV
                  </label>
                  <table className="table table-primary table-hover table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Image</th>
                        <th scope="col">Question</th>
                        <th scope="col">Question (Hindi)</th>
                        {/* <th scope="col">Explanation</th> */}
                        <th scope="col">Marks</th>
                        <th scope="col">Negative</th>
                        {questionType === 'essay' && (
                          <th scope="col">Char Limit</th>
                        )}
                        {questionType === 'bool' && (
                          <th scope="col">Is correct</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {excelFileData.map((rowData, index) => {
                        return (
                          <>
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{rowData[1][0].question_image || ''}</td>
                              <td>{rowData[1][0].question_title || ''}</td>
                              <td>
                                {rowData[1][0].question_title_hindi || ''}
                              </td>
                              {/* <td>
                                {rowData[1][0].question_answer_explanation ||
                                  ''}
                              </td> */}
                              <td>{rowData[1][0].question_marks || 1}</td>
                              <td>
                                {rowData[1][0].question_negative_marking || 0}
                              </td>
                              {questionType === 'essay' && (
                                <td>
                                  {rowData[1][0].question_char_limit || 0}
                                </td>
                              )}
                              {questionType === 'bool' && (
                                <td>
                                  {rowData[1][0].question_is_correct?.toLowerCase() ===
                                  'true'
                                    ? 'True'
                                    : 'False'}
                                </td>
                              )}
                            </tr>

                            {(questionType === 'scq' ||
                              questionType === 'mcq') && (
                              <>
                                <tr>
                                  <td colSpan="6">
                                    <table className="table table-sm table-warning  mb-0">
                                      <thead>
                                        <tr>
                                          <th scope="col">#</th>
                                          <th scope="col">Image</th>
                                          <th scope="col">Option</th>
                                          <th scope="col">Option (Hindi)</th>
                                          <th scope="col">Is Correct</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rowData[1].map(
                                          (optionData, index2) => {
                                            return (
                                              <>
                                                <tr>
                                                  <th scope="row">
                                                    {index2 + 1}
                                                  </th>
                                                  <td>
                                                    {optionData.option_image ||
                                                      ''}
                                                  </td>
                                                  <td>
                                                    {optionData.option_title ||
                                                      ''}
                                                  </td>
                                                  <td>
                                                    {optionData.option_title_hindi ||
                                                      ''}
                                                  </td>
                                                  <td>
                                                    {optionData.is_correct?.toLowerCase() ===
                                                    'true'
                                                      ? 'True'
                                                      : 'False'}
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary mr-auto"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={uploadFileToServer}
              >
                <i className="fa fa-cloud-upload me-1" aria-hidden="true" />
                Upload ({questionType})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadQuestionModal;

const ExampleObj = {
  scq: [
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_one_option_one',
      option_title_hindi: 'option_hindi',
      is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_one_option_two',
      option_title_hindi: 'option_hindi',
      is_correct: 'false',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_one',
      option_title_hindi: 'option_hindi',
      is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_two',
      option_title_hindi: 'option_hindi',
      is_correct: 'false',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_three',
      option_title_hindi: 'option_hindi',
      is_correct: 'false',
    },
  ],
  mcq: [
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_one_option_one',
      option_title_hindi: 'option_hindi',
      is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_one_option_two',
      option_title_hindi: 'option_hindi',
      is_correct: 'false',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_one',
      option_title_hindi: 'option_hindi',
      is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_two',
      option_title_hindi: 'option_hindi',
      is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_two',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      option_image: 'option_image_url',
      option_title: 'question_two_option_three',
      option_title_hindi: 'option_hindi',
      is_correct: 'false',
    },
  ],
  bool: [
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      question_is_correct: 'true',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_tow',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '1',
      question_negative_marking: '0',
      question_is_correct: 'false',
    },
  ],
  essay: [
    {
      question_image: 'question_image_url',
      question_title: 'question_one',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_one_explanation',
      question_marks: '4',
      question_negative_marking: '1',
      question_char_limit: '1000',
    },
    {
      question_image: 'question_image_url',
      question_title: 'question_tow',
      question_title_hindi: 'question_hindi',
      // question_answer_explanation: 'question_two_explanation',
      question_marks: '1',
      question_negative_marking: '0',
      question_char_limit: '500',
    },
  ],
};
