// safety-training.js - Safety Training Record System

let trainingRecords = [];

// Load training records from localStorage
function loadTrainingRecords() {
    const saved = localStorage.getItem('hse_training_records');
    if (saved) {
        trainingRecords = JSON.parse(saved);
        displayTrainingRecords();
    }
}

// Save training records to localStorage
function saveTrainingRecords() {
    localStorage.setItem('hse_training_records', JSON.stringify(trainingRecords));
    updateTrainingStatistics();
}

// Save new training record
function saveTrainingRecord(e) {
    e.preventDefault();
    
    // Get form values
    const record = {
        id: Date.now(),
        employeeName: document.getElementById('employee-name').value,
        employeeId: document.getElementById('employee-id').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        trainingTitle: document.getElementById('training-title').value,
        trainingTitleOther: document.getElementById('training-title').value === 'other-training' 
            ? document.getElementById('other-training').value 
            : '',
        trainingDate: document.getElementById('training-date').value,
        expiryDate: document.getElementById('expiry-date').value,
        trainerName: document.getElementById('trainer-name').value,
        trainerQualification: document.getElementById('trainer-qualification').value,
        trainingHours: parseFloat(document.getElementById('training-hours').value),
        trainingLocation: document.getElementById('training-location').value,
        trainingMethod: Array.from(document.querySelectorAll('input[name="training-method"]:checked'))
            .map(cb => cb.value),
        assessmentMethod: document.getElementById('assessment-method').value,
        result: document.getElementById('result').value,
        comments: document.getElementById('comments').value,
        createdAt: new Date().toISOString()
    };
    
    // Add to records
    trainingRecords.unshift(record);
    saveTrainingRecords();
    displayTrainingRecords();
    
    // Clear form
    clearTrainingForm();
    
    // Show success message
    showNotification('Training record saved successfully!', 'success');
}

// Display training records in table
function displayTrainingRecords() {
    const tbody = document.getElementById('training-table-body');
    const totalRecords = document.getElementById('total-records');
    const passedCount = document.getElementById('passed-count');
    const expiringCount = document.getElementById('expiring-count');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let passed = 0;
    let expiring = 0;
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    trainingRecords.forEach(record => {
        // Count passed records
        if (record.result === 'passed') passed++;
        
        // Count expiring soon records
        if (record.expiryDate) {
            const expiryDate = new Date(record.expiryDate);
            if (expiryDate <= thirtyDaysFromNow && expiryDate >= now) {
                expiring++;
            }
        }
        
        const row = document.createElement('tr');
        
        // Determine row class based on result
        let rowClass = '';
        if (record.result === 'failed') rowClass = 'row-failed';
        if (record.result === 'incomplete') rowClass = 'row-incomplete';
        
        // Check if expired
        if (record.expiryDate && new Date(record.expiryDate) < now) {
            rowClass = 'row-expired';
        }
        
        row.className = rowClass;
        
        // Get display training title
        const displayTitle = record.trainingTitle === 'other-training' 
            ? record.trainingTitleOther 
            : record.trainingTitle.replace('-', ' ').toUpperCase();
        
        row.innerHTML = `
            <td>
                <strong>${record.employeeName}</strong><br>
                <small>${record.employeeId || 'No ID'}</small>
            </td>
            <td>
                ${displayTitle}<br>
                <small>${record.department.toUpperCase()}</small>
            </td>
            <td>
                ${formatDate(record.trainingDate)}<br>
                ${record.expiryDate ? `<small>Exp: ${formatDate(record.expiryDate)}</small>` : ''}
            </td>
            <td>${record.trainerName}</td>
            <td>
                <span class="result-badge result-${record.result}">
                    ${record.result.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn-action view-btn" onclick="viewTrainingRecord(${record.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action edit-btn" onclick="editTrainingRecord(${record.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete-btn" onclick="deleteTrainingRecord(${record.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update counters
    totalRecords.textContent = trainingRecords.length;
    passedCount.textContent = passed;
    expiringCount.textContent = expiring;
}

// Clear training form
function clearTrainingForm() {
    document.getElementById('safety-training-form').reset();
    document.getElementById('other-training').style.display = 'none';
}

// View training record details
function viewTrainingRecord(id) {
    const record = trainingRecords.find(r => r.id === id);
    if (!record) return;
    
    const displayTitle = record.trainingTitle === 'other-training' 
        ? record.trainingTitleOther 
        : record.trainingTitle.replace('-', ' ').toUpperCase();
    
    const details = `
        <div class="record-details">
            <h3>Training Record Details</h3>
            
            <div class="details-grid">
                <div class="detail-item">
                    <strong>Employee:</strong> ${record.employeeName}
                    ${record.employeeId ? ` (${record.employeeId})` : ''}
                </div>
                <div class="detail-item">
                    <strong>Position:</strong> ${record.position || 'Not specified'}
                </div>
                <div class="detail-item">
                    <strong>Department:</strong> ${record.department.toUpperCase()}
                </div>
                <div class="detail-item">
                    <strong>Training:</strong> ${displayTitle}
                </div>
                <div class="detail-item">
                    <strong>Date:</strong> ${formatDate(record.trainingDate)}
                </div>
                <div class="detail-item">
                    <strong>Expiry Date:</strong> ${record.expiryDate ? formatDate(record.expiryDate) : 'N/A'}
                </div>
                <div class="detail-item">
                    <strong>Duration:</strong> ${record.trainingHours} hours
                </div>
                <div class="detail-item">
                    <strong>Location:</strong> ${record.trainingLocation}
                </div>
                <div class="detail-item">
                    <strong>Trainer:</strong> ${record.trainerName}
                    ${record.trainerQualification ? ` (${record.trainerQualification})` : ''}
                </div>
                <div class="detail-item">
                    <strong>Training Method:</strong> ${record.trainingMethod.join(', ')}
                </div>
                <div class="detail-item">
                    <strong>Assessment:</strong> ${record.assessmentMethod || 'Not specified'}
                </div>
                <div class="detail-item">
                    <strong>Result:</strong> 
                    <span class="result-badge result-${record.result}">
                        ${record.result.toUpperCase()}
                    </span>
                </div>
            </div>
            
            ${record.comments ? `
                <div class="detail-comments">
                    <strong>Comments:</strong>
                    <p>${record.comments}</p>
                </div>
            ` : ''}
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="generateRecordPDF(${record.id})">
                    <i class="fas fa-file-pdf"></i> Save as PDF
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    showModal(details);
}

// Edit training record
function editTrainingRecord(id) {
    const record = trainingRecords.find(r => r.id === id);
    if (!record) return;
    
    // Populate form
    document.getElementById('employee-name').value = record.employeeName;
    document.getElementById('employee-id').value = record.employeeId;
    document.getElementById('department').value = record.department;
    document.getElementById('position').value = record.position;
    document.getElementById('training-title').value = record.trainingTitle;
    document.getElementById('training-date').value = record.trainingDate;
    document.getElementById('expiry-date').value = record.expiryDate;
    document.getElementById('trainer-name').value = record.trainerName;
    document.getElementById('trainer-qualification').value = record.trainerQualification;
    document.getElementById('training-hours').value = record.trainingHours;
    document.getElementById('training-location').value = record.trainingLocation;
    document.getElementById('assessment-method').value = record.assessmentMethod;
    document.getElementById('result').value = record.result;
    document.getElementById('comments').value = record.comments;
    
    // Check training methods
    document.querySelectorAll('input[name="training-method"]').forEach(cb => {
        cb.checked = record.trainingMethod.includes(cb.value);
    });
    
    // Handle other training title
    if (record.trainingTitle === 'other-training') {
        document.getElementById('other-training').value = record.trainingTitleOther;
        document.getElementById('other-training').style.display = 'block';
    }
    
    // Remove old record
    trainingRecords = trainingRecords.filter(r => r.id !== id);
    saveTrainingRecords();
    
    showNotification('Record loaded for editing. Update and save.', 'info');
}

// Delete training record
function deleteTrainingRecord(id) {
    if (confirm('Are you sure you want to delete this training record?')) {
        trainingRecords = trainingRecords.filter(r => r.id !== id);
        saveTrainingRecords();
        displayTrainingRecords();
        showNotification('Training record deleted.', 'warning');
    }
}

// Filter training records
function filterTrainingRecords() {
    const searchTerm = document.getElementById('search-records').value.toLowerCase();
    const rows = document.querySelectorAll('#training-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Export to Excel
function exportToExcel() {
    if (trainingRecords.length === 0) {
        showNotification('No records to export.', 'warning');
        return;
    }
    
    // Create CSV content
    let csv = 'Employee Name,Employee ID,Department,Position,Training Title,Training Date,Expiry Date,Trainer,Training Hours,Location,Training Method,Assessment Method,Result,Comments\n';
    
    trainingRecords.forEach(record => {
        const displayTitle = record.trainingTitle === 'other-training' 
            ? record.trainingTitleOther 
            : record.trainingTitle.replace('-', ' ').toUpperCase();
        
        const row = [
            `"${record.employeeName}"`,
            `"${record.employeeId || ''}"`,
            `"${record.department}"`,
            `"${record.position || ''}"`,
            `"${displayTitle}"`,
            `"${record.trainingDate}"`,
            `"${record.expiryDate || ''}"`,
            `"${record.trainerName}"`,
            record.trainingHours,
            `"${record.trainingLocation}"`,
            `"${record.trainingMethod.join(', ')}"`,
            `"${record.assessmentMethod || ''}"`,
            record.result,
            `"${record.comments || ''}"`
        ];
        
        csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `training-records-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Records exported successfully!', 'success');
}

// Generate PDF report
function generateTrainingPDF() {
    if (trainingRecords.length === 0) {
        showNotification('No records to generate PDF.', 'warning');
        return;
    }
    
    const element = document.getElementById('training-export-section');
    const opt = {
        margin: 1,
        filename: `training-report-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// Generate individual record PDF
function generateRecordPDF(id) {
    const record = trainingRecords.find(r => r.id === id);
    if (!record) return;
    
    const displayTitle = record.trainingTitle === 'other-training' 
        ? record.trainingTitleOther 
        : record.trainingTitle.replace('-', ' ').toUpperCase();
    
    const content = `
        <div class="training-certificate" style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; color: #2c3e50;">TRAINING RECORD CERTIFICATE</h1>
            <hr style="border: 2px solid #3498db;">
            
            <div style="margin: 30px 0;">
                <p style="font-size: 18px;">This certifies that</p>
                <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                    ${record.employeeName}
                </h2>
                <p>has successfully completed the following training:</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #3498db;">${displayTitle}</h3>
                    <p><strong>Date:</strong> ${formatDate(record.trainingDate)}</p>
                    <p><strong>Duration:</strong> ${record.trainingHours} hours</p>
                    <p><strong>Trainer:</strong> ${record.trainerName}</p>
                    <p><strong>Location:</strong> ${record.trainingLocation}</p>
                    <p><strong>Result:</strong> <span style="color: ${record.result === 'passed' ? '#27ae60' : '#e74c3c'}">${record.result.toUpperCase()}</span></p>
                </div>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
                <div>
                    <p><strong>Trainer Signature:</strong></p>
                    <p>${record.trainerName}</p>
                    <p>${record.trainerQualification || ''}</p>
                </div>
                <div>
                    <p><strong>Date Issued:</strong></p>
                    <p>${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <div style="margin-top: 50px; font-size: 12px; color: #7f8c8d; text-align: center;">
                <p>This certificate verifies completion of safety training. Expiry date: ${record.expiryDate ? formatDate(record.expiryDate) : 'N/A'}</p>
                <p>Generated by HSE Calculator - Professional Safety Tools</p>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const opt = {
        margin: 0.5,
        filename: `training-certificate-${record.employeeName.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(tempDiv).save();
}

// Update training statistics
function updateTrainingStatistics() {
    const totalEmployees = new Set(trainingRecords.map(r => r.employeeId || r.employeeName)).size;
    const totalHours = trainingRecords.reduce((sum, r) => sum + r.trainingHours, 0);
    const passedRecords = trainingRecords.filter(r => r.result === 'passed').length;
    const passRate = trainingRecords.length > 0 ? Math.round((passedRecords / trainingRecords.length) * 100) : 0;
    
    // Count expiring soon
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = trainingRecords.filter(r => {
        if (!r.expiryDate) return false;
        const expiryDate = new Date(r.expiryDate);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
    }).length;
    
    // Update UI
    document.getElementById('stat-trained').textContent = totalEmployees;
    document.getElementById('stat-hours').textContent = totalHours.toFixed(1);
    document.getElementById('stat-pass-rate').textContent = passRate + '%';
    document.getElementById('stat-expiring').textContent = expiringSoon;
}

// Load sample records for demo
function loadSampleRecords() {
    const sampleRecords = [
        {
            id: 1,
            employeeName: 'John Smith',
            employeeId: 'EMP001',
            department: 'production',
            position: 'Machine Operator',
            trainingTitle: 'lockout-tagout',
            trainingDate: '2024-01-15',
            expiryDate: '2025-01-15',
            trainerName: 'Sarah Johnson',
            trainerQualification: 'Certified Safety Professional',
            trainingHours: 4,
            trainingLocation: 'Main Training Room',
            trainingMethod: ['classroom', 'hands-on'],
            assessmentMethod: 'written-test',
            result: 'passed',
            comments: 'Excellent participation and understanding of procedures.',
            createdAt: '2024-01-15T10:00:00Z'
        },
        {
            id: 2,
            employeeName: 'Maria Garcia',
            employeeId: 'EMP002',
            department: 'warehouse',
            position: 'Forklift Operator',
            trainingTitle: 'forklift',
            trainingDate: '2024-02-20',
            expiryDate: '2025-02-20',
            trainerName: 'Robert Chen',
            trainerQualification: 'Forklift Instructor Certified',
            trainingHours: 8,
            trainingLocation: 'Warehouse Area B',
            trainingMethod: ['hands-on', 'on-the-job'],
            assessmentMethod: 'practical-demo',
            result: 'passed',
            comments: 'Demonstrated excellent control and safety awareness.',
            createdAt: '2024-02-20T09:00:00Z'
        },
        {
            id: 3,
            employeeName: 'David Wilson',
            employeeId: 'EMP003',
            department: 'maintenance',
            position: 'Maintenance Technician',
            trainingTitle: 'confined-space',
            trainingDate: '2024-03-10',
            expiryDate: '2024-09-10',
            trainerName: 'Sarah Johnson',
            trainerQualification: 'Certified Safety Professional',
            trainingHours: 6,
            trainingLocation: 'Conference Room A',
            trainingMethod: ['classroom'],
            assessmentMethod: 'written-test',
            result: 'passed',
            comments: 'Requires refresher in 6 months as per policy.',
            createdAt: '2024-03-10T13:00:00Z'
        },
        {
            id: 4,
            employeeName: 'Lisa Wong',
            employeeId: 'EMP004',
            department: 'office',
            position: 'Administrative Assistant',
            trainingTitle: 'emergency-response',
            trainingDate: '2024-04-05',
            expiryDate: '2025-04-05',
            trainerName: 'Michael Brown',
            trainerQualification: 'Emergency Response Coordinator',
            trainingHours: 2,
            trainingLocation: 'Office Conference Room',
            trainingMethod: ['classroom', 'online'],
            assessmentMethod: 'oral-quiz',
            result: 'passed',
            comments: 'Good understanding of evacuation procedures.',
            createdAt: '2024-04-05T14:00:00Z'
        },
        {
            id: 5,
            employeeName: 'James Miller',
            employeeId: 'EMP005',
            department: 'quality',
            position: 'Quality Inspector',
            trainingTitle: 'hazcom',
            trainingDate: '2024-01-30',
            expiryDate: '2025-01-30',
            trainerName: 'Robert Chen',
            trainerQualification: 'Chemical Safety Specialist',
            trainingHours: 3,
            trainingLocation: 'Quality Lab',
            trainingMethod: ['classroom'],
            assessmentMethod: 'written-test',
            result: 'failed',
            comments: 'Needs retraining on chemical labeling requirements.',
            createdAt: '2024-01-30T11:00:00Z'
        }
    ];
    
    trainingRecords = sampleRecords;
    saveTrainingRecords();
    displayTrainingRecords();
    showNotification('Sample training records loaded successfully!', 'success');
}

// Clear all records
function clearAllRecords() {
    if (confirm('Are you sure you want to clear ALL training records? This action cannot be undone.')) {
        trainingRecords = [];
        saveTrainingRecords();
        displayTrainingRecords();
        showNotification('All training records cleared.', 'warning');
    }
}

// Print training records
function printTrainingRecords() {
    window.print();
}

// Generate training certificate
function generateTrainingCertificate() {
    showNotification('Select a record and use "View Details" to generate individual certificates.', 'info');
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showModal(content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
    document.body.style.overflow = '';
}
