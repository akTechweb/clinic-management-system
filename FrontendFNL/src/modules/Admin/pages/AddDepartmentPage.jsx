export default function AddDepartmentPage({
  formData,
  handleChange,
  handleSubmit,
  isEdit = false,
}) {
  return (
    <div className="container mt-5">
      <h2>{isEdit ? "Edit Department" : "Add Department"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="dept_code" placeholder="Code"
          value={formData.dept_code} onChange={handleChange}
          className="form-control mb-2" />

        <input name="dept_name" placeholder="Name"
          value={formData.dept_name} onChange={handleChange}
          className="form-control mb-2" />

        <select name="status" value={formData.status}
          onChange={handleChange} className="form-control mb-3">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="btn btn-primary w-100">
          {isEdit ? "Edit" : "Add"}
        </button>
      </form>
    </div>
  );
}