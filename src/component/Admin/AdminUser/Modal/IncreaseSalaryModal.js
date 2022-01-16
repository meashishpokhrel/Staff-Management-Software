import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../HelperFunction/Axios";

const IncreaseSalaryModal = (props) => {
  const userId = props.userId;

  const [salaryData, setSalaryData] = useState({});
  const [newSalaryAmount, setNewSalaryAmount] = useState(0);
  const [additionAmount, setAdditionAmount] = useState(0);

  const [formData, setFormData] = useState({
    increased_by: "P",
    value: 0,
    valid_from: "",
  });

  const { increased_by, value, valid_from } = formData;

  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return { ...prevFormData, [e.target.name]: e.target.value };
    });
    if (e.target.name === "value") {
      calculateNewSalary(e.target.value);
    }
  };

  const calculateNewSalary = (amount) => {
    if (salaryData.length > 0) {
      if (increased_by === "P") {
        increaseByPercentage(Number(amount));
      } else {
        increaseByFixedAmount(Number(amount));
      }
    }
  };

  const increaseByPercentage = (percentage) => {
    let currentSalary = salaryData[0].amount;
    let newSalary = currentSalary + (percentage / 100) * currentSalary;
    setNewSalaryAmount(newSalary);
    setAdditionAmount(newSalary - currentSalary);
  };

  const increaseByFixedAmount = (fixedAmount) => {
    let currentSalary = salaryData[0].amount;
    let newSalary = currentSalary + fixedAmount;
    setNewSalaryAmount(newSalary);
    setAdditionAmount(newSalary - currentSalary);
  };

  useEffect(() => {
    const getSalaryData = async () => {
      await axiosInstance
        .get(`/salary/employee/${userId}/list/`)
        .then((res) => {
          setSalaryData(res.data.salaries);
        })
        .catch((err) => {
          // window.alert("Error!!!")
        });
    };

    getSalaryData();
  }, []);

  const getMessage = (salaryResData) => {
    const notification = `${salaryResData.user}, your salary has been increased from ${salaryResData.previous_salary} to ${salaryResData.new_salary} valid from ${salaryResData.valid_from}`;
    return notification;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`/salary/employee/${userId}/update/`, {
        increased_by,
        value,
        valid_from,
      })
      .then((res) => {
        window.document.getElementById(`closeSalaryModal${userId}`).click();
        // Call for Notifications
        const [datetime, message, read, posted_for] = [
          new Date().toISOString(),
          getMessage(res.data),
          false,
          salaryData[0].employee.id,
        ];
        axiosInstance
          .post(`/notification/create/`, {
            datetime,
            message,
            read,
            posted_for,
          })
          .then((res) => {
            window.alert("Salary has been increased");
            window.location.reload();
          })
          .catch((err) => {
            window.alert("Error increasing salary!!!");
          });
      })
      .catch((err) => {
        window.alert("Error : Salary Not Increased !!!");
      });
  };

  return (
    <div
      className="modal fade bd-example-modal"
      id={`increaseSalaryModal${userId}`}
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <div className="row">
            <div className="col-md-12">
              <div className="heading_modal d-flex justify-content-between">
                <div>
                  <span className="heading_text">Increase Salary</span>
                </div>
                <div>
                  <a
                    className="btn cross_button"
                    data-dismiss="modal"
                    href="/#"
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label for="current_salary">Current Salary</label>
                  <br />
                  <span className="f_24 text-primary">
                    ${salaryData.length > 0 ? salaryData[0].amount : ""}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="increased_by">Increase By : </label>
                  <br />
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="increased_by"
                      id="inlineRadio1"
                      value="P"
                      onChange={(e) => handleChange(e)}
                      selected
                    />
                    <label className="form-check-label" for="inlineRadio1">
                      Percentage(%)
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="increased_by"
                      id="inlineRadio2"
                      value="A"
                      onChange={(e) => handleChange(e)}
                    />
                    <label className="form-check-label" for="inlineRadio2">
                      Fixed Amount
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <label for="amount" className="form_input_head">
                  Amount
                </label>
                <div className="input-group mb-3 ">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      +%
                    </span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    name="value"
                    id="value"
                    value={value}
                    aria-describedby="basic-addon3"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="valid_from">Valid From</label>
                  <input
                    type="date"
                    className="form-control"
                    name="valid_from"
                    id="valid_from"
                    value={valid_from}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="addition_amount">Addition Amount</label>
                  <br />
                  <span className="f_24 text-primary">+${additionAmount}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label for="new_salary">New Salary</label>
                  <br />
                  <span className="f_36 text-primary">
                    {newSalaryAmount}
                    <sup>$</sup>
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div className="col-md-12">
              <button className="btn btn_primary mr-3">Increase Salary</button>
              <button className="btn btn-secondary" id={`closeSalaryModal${userId}`} data-dismiss="modal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncreaseSalaryModal;
