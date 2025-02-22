import React from 'react';

function HorizontalSelects() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
      {/* Select 1 */}
      <div style={{ width: '80px' }}>
        <div style={{ textAlign: 'center' }}>Title 1</div>
        <select style={{ width: '80px' }}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </div>

      {/* Select 2 */}
      <div style={{ width: '80px' }}>
        <div style={{ textAlign: 'center' }}>Title 2</div>
        <select style={{ width: '80px' }}>
          <option value="optionA">Option A</option>
          <option value="optionB">Option B</option>
        </select>
      </div>

      {/* Select 3 */}
      <div style={{ width: '80px' }}>
        <div style={{ textAlign: 'center' }}>Title 3</div>
        <select style={{ width: '80px' }}>
          <option value="valueX">Value X</option>
          <option value="valueY">Value Y</option>
        </select>
      </div>
    </div>
  );
}

export default HorizontalSelects;