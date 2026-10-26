from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# قاعدة بيانات مؤقتة لتخزين البيانات (يمكن ربطها لاحقاً بـ SQLite أو PostgreSQL)
user_data = {
    "courses": [
        {"id": 1, "code": "ENG116", "name": "Discrete Mathematics", "hours": 3, "day": "الأحد", "time": "09:00 AM - 11:00 AM", "location": "مدرج 2"},
        {"id": 2, "code": "EE101", "name": "Electrical & Electronics", "hours": 4, "day": "الإثنين", "time": "11:30 AM - 02:30 PM", "location": "معامل الكهرباء"}
    ],
    "tasks": [
        {"id": 1, "title": "تسليم Sheet 1 - Discrete Math", "type": "شيت", "deadline": "2026-11-02", "completed": False},
        {"id": 2, "title": "تقرير معمل إلكترونيات", "type": "تقرير", "deadline": "2026-11-05", "completed": True}
    ]
}

@app.route('/')
def home():
    return render_template('index.html')

# API الحصول على المواد والجدول
@app.route('/api/courses', methods=['GET', 'POST'])
def handle_courses():
    if request.method == 'POST':
        new_course = request.json
        new_course['id'] = len(user_data['courses']) + 1
        user_data['courses'].append(new_course)
        return jsonify({"message": "تمت إضافة المادة بنجاح!", "course": new_course}), 201
    return jsonify(user_data['courses'])

# API إدارة المهام والشيتات
@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        new_task = request.json
        new_task['id'] = len(user_data['tasks']) + 1
        new_task['completed'] = False
        user_data['tasks'].append(new_task)
        return jsonify({"message": "تمت إضافة المهمة بنجاح!", "task": new_task}), 201
    return jsonify(user_data['tasks'])

@app.route('/api/tasks/<int:task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    for task in user_data['tasks']:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            return jsonify({"message": "تم تحديث حالة المهمة", "completed": task['completed']})
    return jsonify({"error": "المهمة غير موجودة"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
