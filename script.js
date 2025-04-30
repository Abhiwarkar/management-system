// Student Registration System - JavaScript

// DOM Elements - Main Form
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const emailInput = document.getElementById('email');
const classInput = document.getElementById('class');
const contactInput = document.getElementById('contact');
const submitBtn = document.getElementById('submitBtn');

// DOM Elements - Table and Search
const studentTableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');

// DOM Elements - Modal
const editModal = document.getElementById('editModal');
const editStudentForm = document.getElementById('editStudentForm');
const editNameInput = document.getElementById('editName');
const editIdInput = document.getElementById('editId');
const editEmailInput = document.getElementById('editEmail');
const editClassInput = document.getElementById('editClass');
const editContactInput = document.getElementById('editContact');
const updateBtn = document.getElementById('updateBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const closeModalBtn = document.querySelector('.close-modal');

// Variables
let students = JSON.parse(localStorage.getItem('students')) || [];
let currentEditId = null;

// Initialize the app
function init() {
    renderStudentTable();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Main form
    studentForm.addEventListener('submit', handleFormSubmit);
    
    // Search - listen for input changes to automatically update results
    searchInput.addEventListener('input', () => {
        handleSearch();
    });
    
    // Modal
    editStudentForm.addEventListener('submit', handleEditFormSubmit);
    cancelEditBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });
}

// Handle main form submission (adding new student)
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate inputs
    if (!validateMainForm()) return;
    
    const student = {
        id: idInput.value.trim(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        class: classInput.value.trim(),
        contact: contactInput.value.trim()
    };
    
    // Add new student
    addStudent(student);
    
    // Reset form
    studentForm.reset();
    
    // Update the table
    renderStudentTable();
}

// Validate main form inputs
function validateMainForm() {
    let isValid = true;
    
    // Name validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(nameInput.value.trim())) {
        document.getElementById('nameError').textContent = 'Name should contain only letters';
        isValid = false;
    } else {
        document.getElementById('nameError').textContent = '';
    }
    
    // ID validation (only numbers)
    const idRegex = /^\d+$/;
    if (!idRegex.test(idInput.value.trim())) {
        document.getElementById('idError').textContent = 'ID should contain only numbers';
        isValid = false;
    } else {
        document.getElementById('idError').textContent = '';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    } else {
        document.getElementById('emailError').textContent = '';
    }
    
    // Contact validation (only numbers)
    const contactRegex = /^\d+$/;
    if (!contactRegex.test(contactInput.value.trim())) {
        document.getElementById('contactError').textContent = 'Contact should contain only numbers';
        isValid = false;
    } else {
        document.getElementById('contactError').textContent = '';
    }
    
    return isValid;
}

// Validate edit form inputs
function validateEditForm() {
    let isValid = true;
    
    // Name validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(editNameInput.value.trim())) {
        document.getElementById('editNameError').textContent = 'Name should contain only letters';
        isValid = false;
    } else {
        document.getElementById('editNameError').textContent = '';
    }
    
    // ID validation (only numbers)
    const idRegex = /^\d+$/;
    if (!idRegex.test(editIdInput.value.trim())) {
        document.getElementById('editIdError').textContent = 'ID should contain only numbers';
        isValid = false;
    } else {
        document.getElementById('editIdError').textContent = '';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmailInput.value.trim())) {
        document.getElementById('editEmailError').textContent = 'Please enter a valid email';
        isValid = false;
    } else {
        document.getElementById('editEmailError').textContent = '';
    }
    
    // Contact validation (only numbers)
    const contactRegex = /^\d+$/;
    if (!contactRegex.test(editContactInput.value.trim())) {
        document.getElementById('editContactError').textContent = 'Contact should contain only numbers';
        isValid = false;
    } else {
        document.getElementById('editContactError').textContent = '';
    }
    
    return isValid;
}

// Add a new student
function addStudent(student) {
    // Check if student ID already exists
    if (students.some(s => s.id === student.id)) {
        alert('Student with this ID already exists!');
        return;
    }
    
    students.push(student);
    saveToLocalStorage();
    alert('Student added successfully!');
}

// Handle edit form submission
function handleEditFormSubmit(e) {
    e.preventDefault();
    
    // Validate inputs
    if (!validateEditForm()) return;
    
    const updatedStudent = {
        id: editIdInput.value.trim(),
        name: editNameInput.value.trim(),
        email: editEmailInput.value.trim(),
        class: editClassInput.value.trim(),
        contact: editContactInput.value.trim()
    };
    
    // Update student
    updateStudent(updatedStudent);
    
    // Close modal
    closeModal();
    
    // Update the table
    renderStudentTable();
}

// Update existing student
function updateStudent(updatedStudent) {
    const index = students.findIndex(student => student.id === currentEditId);
    
    if (index !== -1) {
        // If the ID has been changed, check if the new ID already exists
        if (updatedStudent.id !== currentEditId && students.some(s => s.id === updatedStudent.id)) {
            alert('Student with this ID already exists!');
            return;
        }
        
        const oldName = students[index].name;
        students[index] = updatedStudent;
        saveToLocalStorage();
        alert('Student details updated successfully!');
    } else {
        alert('Error updating student details');
    }
    
    currentEditId = null;
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        const studentToDelete = students.find(s => s.id === id);
        if (studentToDelete) {
            const studentName = studentToDelete.name;
            students = students.filter(student => student.id !== id);
            saveToLocalStorage();
            renderStudentTable();
            alert(`Student ${studentName} has been deleted successfully!`);
        }
    }
}

// Open the edit modal
function openEditModal(student) {
    // Set the current edit ID
    currentEditId = student.id;
    
    // Set form values
    editNameInput.value = student.name;
    editIdInput.value = student.id;
    editEmailInput.value = student.email;
    editClassInput.value = student.class;
    editContactInput.value = student.contact;
    
    // Clear any error messages
    clearEditFormErrors();
    
    // Show the modal
    editModal.style.display = 'block';
    
    // Focus on the first field
    editNameInput.focus();
}

// Close the edit modal
function closeModal() {
    editModal.style.display = 'none';
    currentEditId = null;
    editStudentForm.reset();
    clearEditFormErrors();
}

// Clear edit form error messages
function clearEditFormErrors() {
    document.getElementById('editNameError').textContent = '';
    document.getElementById('editIdError').textContent = '';
    document.getElementById('editEmailError').textContent = '';
    document.getElementById('editClassError').textContent = '';
    document.getElementById('editContactError').textContent = '';
}

// Render student table
function renderStudentTable(filteredStudents) {
    const studentsToRender = filteredStudents || students;
    
    if (studentsToRender.length === 0) {
        studentTableBody.innerHTML = '<tr><td colspan="6" class="no-records">No student records found</td></tr>';
        return;
    }
    
    studentTableBody.innerHTML = studentsToRender.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.class}</td>
            <td>${student.contact}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${student.id}">Edit</button>
                <button class="delete-btn" data-id="${student.id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            const student = students.find(s => s.id === studentId);
            if (student) openEditModal(student);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        renderStudentTable(); // Show all records when search field is empty
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm) ||
        student.contact.toLowerCase().includes(searchTerm)
    );
    
    renderStudentTable(filteredStudents);
}

// Save to local storage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Initialize the application
init();