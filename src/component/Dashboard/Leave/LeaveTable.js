import React from "react";
import checkAction from "../../../assets/icons/checkAction.svg"
import { statusStyle } from "../../../HelperFunction/GenericFunction";

const LeaveTable = (props) => {
  const leaveTableData = props.leaveDetail;
  console.log(leaveTableData);

  const displayLeaveData = () => {
    let result = [];

    leaveTableData.map((data) => {
      result.push(
        <tr key={data.leave_id}>
          <td className="text-muted muted_text">
            {data.leave_from} - {data.leave_to}
          </td>
          <td>{data.pay === "P" ? "Paid" : "Unpaid"}</td>
          <td className="text-muted muted_text">{data.leave_type}</td>
          <td className="text-muted muted_text">{data.reason}</td>
          <td className={`muted_text ${statusStyle(data.approved)}`}>{data.approved}</td>
          {/* <td>
            <img src={checkAction} alt="check action" />
          </td> */}
        </tr>
      );
    });

    return result;
  };

  return (
    <div>
      {leaveTableData && (
        <div className="div_format mt-4 pt-3">
          <span className="heading_text">My leave History</span>
          <div className="check_in_table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">From-To Date</th>
                  <th scope="col">Paid/Unpaid</th>
                  <th scope="col">Leave Type</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Status</th>
                  {/* <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>{displayLeaveData()}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveTable;
