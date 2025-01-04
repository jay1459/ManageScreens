document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const fileDetails = document.getElementById('fileDetails');
  const nameInput = document.getElementById('nameInput');
  const startDateInput = document.getElementById('startDateInput');
  const endDateInput = document.getElementById('endDateInput');
  const durationInput = document.getElementById('durationInput');

  if (file) {
    fileDetails.innerHTML = `
      <p><strong>File Name:</strong> ${file.name}</p>
      <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>File Type:</strong> ${file.type}</p>
    `;
    nameInput.value = file.name;

    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    startDateInput.value = now.toISOString().slice(0, 16);
    endDateInput.value = oneMonthLater.toISOString().slice(0, 16);
    durationInput.value = 20;
  } else {
    fileDetails.innerHTML = '';
    nameInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    durationInput.value = '';
  }
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const loadingSpinner = document.getElementById('loadingSpinner');
  const successMessage = document.getElementById('successMessage');
  const endpointsMessage = document.getElementById('endpointsMessage');
  const nameInput = document.getElementById('nameInput').value;
  const durationInput = document.getElementById('durationInput').value;
  const startDateInput = document.getElementById('startDateInput').value;
  const endDateInput = document.getElementById('endDateInput').value;
  const isEnabledInput = document.getElementById('isEnabledInput').checked;

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', nameInput);
    formData.append('duration', durationInput);
    formData.append('start_date', startDateInput);
    formData.append('end_date', endDateInput);
    formData.append('is_enabled', isEnabledInput);

    loadingSpinner.style.display = 'block';
    successMessage.style.display = 'none';
    endpointsMessage.style.display = 'none';

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      loadingSpinner.style.display = 'none';
      successMessage.style.display = 'block';
    })
    .catch(error => {
      loadingSpinner.style.display = 'none';
      console.error('Error:', error);
    });
  } else {
    alert('Please select a file to upload');
  }
});

const loadEndpoints = () => {
  fetch('/endpoints')
    .then(response => response.json())
    .then(data => {
      const fileAssetEndpointsDiv = document.getElementById('fileAssetEndpoints');
      const assetEndpointsDiv = document.getElementById('assetEndpoints');

      fileAssetEndpointsDiv.innerHTML = '';
      assetEndpointsDiv.innerHTML = '';

      data.fileAssetEndpoints.forEach((endpoint, index) => {
        fileAssetEndpointsDiv.innerHTML += `
          <div class="endpoint">
            <input type="text" name="fileAssetEndpoints" value="${endpoint}" class="text-input" />
            <button type="button" class="delete-button" onclick="deleteEndpoint(this)">Delete</button>
          </div>
        `;
      });

      data.assetEndpoints.forEach((endpoint, index) => {
        assetEndpointsDiv.innerHTML += `
          <div class="endpoint">
            <input type="text" name="assetEndpoints" value="${endpoint}" class="text-input" />
            <button type="button" class="delete-button" onclick="deleteEndpoint(this)">Delete</button>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('Error loading endpoints:', error);
    });
};

const deleteEndpoint = (button) => {
  const endpointDiv = button.parentElement;
  endpointDiv.remove();
};

document.getElementById('addFileAssetEndpoint').addEventListener('click', () => {
  const fileAssetEndpointsDiv = document.getElementById('fileAssetEndpoints');
  fileAssetEndpointsDiv.innerHTML += `
    <div class="endpoint">
      <input type="text" name="fileAssetEndpoints" class="text-input" />
      <button type="button" class="delete-button" onclick="deleteEndpoint(this)">Delete</button>
    </div>
  `;
});

document.getElementById('addAssetEndpoint').addEventListener('click', () => {
  const assetEndpointsDiv = document.getElementById('assetEndpoints');
  assetEndpointsDiv.innerHTML += `
    <div class="endpoint">
      <input type="text" name="assetEndpoints" class="text-input" />
      <button type="button" class="delete-button" onclick="deleteEndpoint(this)">Delete</button>
    </div>
  `;
});

document.getElementById('endpointsForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const fileAssetEndpoints = Array.from(document.getElementsByName('fileAssetEndpoints')).map(input => input.value);
  const assetEndpoints = Array.from(document.getElementsByName('assetEndpoints')).map(input => input.value);

  const newEndpoints = {
    fileAssetEndpoints,
    assetEndpoints
  };

  fetch('/update-endpoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEndpoints)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
  })
  .catch(error => {
    console.error('Error updating endpoints:', error);
  });
});

loadEndpoints();
