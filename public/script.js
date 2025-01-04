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

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      loadingSpinner.style.display = 'none';
      successMessage.style.display = 'block';
      // Handle success
    })
    .catch(error => {
      loadingSpinner.style.display = 'none';
      console.error('Error:', error);
    });
  } else {
    alert('Please select a file to upload');
  }
});
