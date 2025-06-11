import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [ownerName, setOwnerName] = useState("");
  const [carData, setCarData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);
  const [navigation, setNavigation] = useState("home");

  const handleFormSubmit = async (formData) => {
    const response = await fetch("api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerName: formData.get("ownerName"),
      }),
    });
    const data = await response.json();
    if (data.error) {
      setErrorMsg(data.error);
      setCarData([]);
    }

    setCarData(data);
    setErrorMsg("");
  };

  return (
    <>
      {navigation !== "home" && (
        <a href="#" className="back-btn" onClick={() => setNavigation("home")}>
          Back
        </a>
      )}
      {navigation === "home" && (
        <div>
          <nav>
            <a onClick={() => setNavigation("cars")}>Cars</a>
            <a onClick={() => setNavigation("upload")}>Upload</a>
          </nav>
        </div>
      )}
      {navigation === "cars" && (
        <div>
          <h2>Welcome to Cars Pool</h2>
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleFormSubmit(formData);
            }}
          >
            <input
              type="text"
              name="ownerName"
              placeholder="Enter a name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <button type="submit">Get car data</button>
            {/* <button onClick={getNames}>Get car data</button> */}
          </form>
          {carData.length !== 0 && errorMsg.length === 0 && (
            <table>
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>HP</th>
                </tr>
              </thead>
              <tbody>
                {carData.map((car, index) => {
                  return (
                    <tr key={index}>
                      <td>{car.car}</td>
                      <td>{car.model}</td>
                      <td>{car.year}</td>
                      <td>{car.hp}</td>
                      <td>
                        <RowForm
                          car={car}
                          ownerName={ownerName}
                          setSuccessMsg={setSuccessMsg}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {carData.length === 0 && !errorMsg ? (
            <div>No cars found</div>
          ) : (
            <div>{errorMsg}</div>
          )}
          {successMsg && <div className="success">{successMsg}</div>}
        </div>
      )}
      {navigation === "upload" && (
        <div>
          <h2>File Uploading</h2>
          <UploadForm />
          <FilesList />
        </div>
      )}
    </>
  );
}

const RowForm = ({ car, ownerName, setSuccessMsg }) => {
  const [sendByEmail, setSendByEmail] = useState(false);

  const downloadPdf = async (formData) => {
    const response = await fetch("api/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carId: formData.get("carId"),
        sendByEmail: formData.get("sendByEmail"),
        ownerName: ownerName,
        email: formData.get("email"),
      }),
    });
    const data = await response.json();

    if (data.status === "success") {
      setSuccessMsg(data.message);
      window.location.href = `/api/download/${data.fileName}`;
    }
  };

  return (
    <form
      className="download-form"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        downloadPdf(formData);
      }}
    >
      <input type="hidden" name="carId" value={car.id} />
      <button type="submit">Download</button>
      <label htmlFor="sendByEmail">Send to email</label>
      <input
        type="checkbox"
        name="sendByEmail"
        onChange={() => setSendByEmail(!sendByEmail)}
      />
      {sendByEmail && (
        <>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Please enter your email..."
          />
        </>
      )}
    </form>
  );
};

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState("");
  const formSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const response = await fetch("api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Filename": file.name,
      },
      body: file,
    });
    const data = await response.json();
    if (data.status === "success") {
      setStatusMsg(data.message);
      setTimeout(() => {
        setStatusMsg("");
      }, 3000);
    } else {
      setStatusMsg("Error uploading file");
    }
    console.log(response);
  };
  return (
    <form className="upload-form" onSubmit={(e) => formSubmit(e)}>
      <input type="file" ref={fileInputRef} className="file-input" />
      <button type="submit">Upload</button>
      {statusMsg && <div>{statusMsg}</div>}
    </form>
  );
};

const FilesList = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const response = await fetch("api/files");
    const data = await response.json();
    console.log(data);

    setFiles(data);
  };

  return (
    <div>
      <h3>Uploaded Files</h3>
      <button onClick={fetchFiles}>Refresh Files</button>
      <ul>
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <a href={`/api/files/${file}`}>{file}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
