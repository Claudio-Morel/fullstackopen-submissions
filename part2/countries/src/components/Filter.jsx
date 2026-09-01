const Filter = ({ filterString, handleFilterChange }) => {
  return (
    <div>
        find countries<input value={filterString} onChange={handleFilterChange}></input>
    </div>
  )
}

export default Filter
