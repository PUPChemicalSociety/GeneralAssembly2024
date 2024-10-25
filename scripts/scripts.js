let referenceCode = '';

function generateReferenceCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'flex' : 'none';
}

function generateTicket() {
    document.getElementById('nameError').innerText = '';
    document.getElementById('sectionError').innerText = '';
    document.getElementById('sessionError').innerText = '';

    const name = document.getElementById('name').value.trim();
    const section = document.getElementById('section').value;
    const session = document.getElementById('session').value;

    // Input validation
    let valid = true;
    if (!name) {
        document.getElementById('nameError').innerText = 'Name is required.';
        valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        document.getElementById('nameError').innerText = 'Name can only contain letters and spaces.';
        valid = false;
    }

    if (!section) {
        document.getElementById('sectionError').innerText = 'Section is required.';
        valid = false;
    }

    if (!session) {
        document.getElementById('sessionError').innerText = 'Session is required.';
        valid = false;
    }

    if (!valid) return;

    // Hide form and show ticket details
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'flex'; 

    // Generate ticket reference code
    referenceCode = generateReferenceCode();

    let sessionTitle = '';
    let eventDate = 'October 30, 2024'; // GA date
    let eventTime = '';

    // Determine session title and time
    if (session === 'Afternoon Session') {
        sessionTitle = 'Here is your General Assembly Afternoon Session Ticket';
        eventTime = '1:00 PM - 5:00 PM';
    } else if (session === 'Morning Session') {
        sessionTitle = 'Here is your General Assembly Morning Session Ticket';
        eventTime = '9:00 AM - 12:00 Noon';
    }

    // Set the session title in the header
    document.getElementById('sessionTitle').innerText = sessionTitle;

    // Insert details into the ticket
    const ticketDetails = `
        <p>Date: ${eventDate}</p>
        <p>Time: ${eventTime}</p>
        <p>Name: ${name}</p>
        <p>Year & Section: ${section}</p>
        <p>Session: ${session}</p>
        <p>Reference Code: ${referenceCode}</p>
    `;
    document.getElementById('ticketDetails').innerHTML = ticketDetails;

    // Google Sheets
    sendToGoogleSheet(name, section, session, referenceCode);
}

function sendToGoogleSheet(name, section, session, referenceCode) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('section', section);
    formData.append('session', session);
    formData.append('referenceCode', referenceCode);

    fetch('https://script.google.com/macros/s/AKfycbyj5DlZ_CKA5AatNayyqVCeO4Bcne85elvOMl650gRjkGhzG-glz3xw55znWBSvtKjy/exec', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            console.log('Data sent to Google Sheets successfully.');
        } else {
            console.log('Error sending data to Google Sheets.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function downloadReceipt() {
    const ticketContainer = document.getElementById('ticket-container');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
  
    // Hide the download button and loading indicator
    downloadBtn.style.display = 'none';
    loadingIndicator.style.display = 'none';
  
    html2canvas(ticketContainer, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      logging: true,
    }).then(canvas => {
      const imageUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUrl;
      downloadLink.download = `Ticket-${referenceCode}.png`;
      downloadLink.click();
  
      // Show loading indicator after the download link is clicked
      loadingIndicator.style.display = 'flex';
    }).finally(() => {
      // Show the download button again and hide loading indicator after download
      downloadBtn.style.display = 'block';
      loadingIndicator.style.display = 'none'; 
    });
}
