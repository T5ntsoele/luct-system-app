import React from 'react';

const Rating = () => {
  return (
    <div>
      <h4>Student Ratings Summary</h4>
      <p>View average ratings and feedback for lectures under your supervision.</p>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Lecturer</th>
            <th>Course</th>
            <th>Avg Rating</th>
            <th>Feedback Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dr. Radebe</td>
            <td>Web Development</td>
            <td>★★★★☆ (4.3)</td>
            <td>12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Rating;