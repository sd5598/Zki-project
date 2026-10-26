document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadTasks();
});

// 1. جلب المحاضرات والجدول من السيرفر
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        const grid = document.getElementById('coursesGrid');
        grid.innerHTML = '';

        courses.forEach(c => {
            grid.innerHTML += `
                <div class="course-card">
                    <h4>${c.code} (${c.hours} ساعات)</h4>
                    <h3>${c.name}</h3>
                    <p><i class="fa-regular fa-clock"></i> ${c.day} - ${c.time}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${c.location}</p>
                </div>
            `;
        });
    } catch (err) {
        console.error('خطأ في تحميل المواد:', err);
    }
}

// 2. جلب الشيتات والمهام الهندسية
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const list = document.getElementById('tasksList');
        list.innerHTML = '';

        tasks.forEach(t => {
            list.innerHTML += `
                <div class="task-item ${t.completed ? 'completed' : ''}">
                    <div>
                        <strong>[${t.type}]</strong> ${t.title}
                        <br><small><i class="fa-regular fa-calendar"></i> الموعد النهائي: ${t.deadline}</small>
                    </div>
                    <button class="btn-secondary" onclick="toggleTask(${t.id})">
                        ${t.completed ? '<i class="fa-solid fa-rotate-left"></i>' : '<i class="fa-solid fa-check"></i> اكتمل'}
                    </button>
                </div>
            `;
        });
    } catch (err) {
        console.error('خطأ في تحميل المهام:', err);
    }
}

// 3. تغيير حالة المهمة (مكتملة/غير مكتملة)
async function toggleTask(taskId) {
    await fetch(`/api/tasks/${taskId}/toggle`, { method: 'PUT' });
    loadTasks();
}

// 4. حاسبة الـ GPA للهندسة
function addGpaRow() {
    const container = document.getElementById('gpaRows');
    const newRow = document.createElement('div');
    newRow.className = 'gpa-row';
    newRow.innerHTML = `
        <input type="text" placeholder="اسم المادة" class="gpa-name">
        <input type="number" placeholder="الساعات" class="gpa-hours" min="1" max="6">
        <select class="gpa-grade">
            <option value="4.0">A / A+</option>
            <option value="3.7">A-</option>
            <option value="3.3">B+</option>
            <option value="3.0">B</option>
            <option value="2.7">B-</option>
            <option value="2.3">C+</option>
            <option value="2.0">C</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
        </select>
    `;
    container.appendChild(newRow);
}

function calculateGPA() {
    const hoursElements = document.querySelectorAll('.gpa-hours');
    const gradeElements = document.querySelectorAll('.gpa-grade');

    let totalPoints = 0;
    let totalHours = 0;

    for (let i = 0; i < hoursElements.length; i++) {
        const hours = parseFloat(hoursElements[i].value);
        const grade = parseFloat(gradeElements[i].value);

        if (!isNaN(hours) && hours > 0) {
            totalHours += hours;
            totalPoints += (hours * grade);
        }
    }

    if (totalHours > 0) {
        const gpa = (totalPoints / totalHours).toFixed(2);
        document.getElementById('gpaScore').innerText = gpa;
    } else {
        alert('برجاء أدخل الساعات المعتمدة بشكل صحيح لكل مادة.');
    }
}
